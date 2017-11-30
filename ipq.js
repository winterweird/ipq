"use strict"

/**
 * An implementation of an Index Priority Queue (a data structure which may
 * function like a priority queue but also have randomly accessible elements).
 *
 * @param size The number of elements the IPQ should support
 * @param less An optional comparator determining whether one element should be
 * considered less than another (default: <)
 */
function IndexPriorityQueue(size, less) {
    let elements = new Array(size);    // is a priority queue
    let pq = new Array(size).fill(-1); // at logical index i, store j = physical index in elements
    let qp = new Array(size).fill(-1); // at physical index i, store j = logical index in IPQ

    let length = 0;
    let capacity = size;
    
    if (less === undefined)
        less = (a, b) => {return a < b;};
    
    // helper function: exchange elements at index a and b
    const exch = (a,b) => {
        const tmp = elements[a];
        elements[a] = elements[b];
        elements[b] = tmp;
    };

    // helper function: update pq and qp such that the physical index points to
    // the given logical index in qp, and the logical index points to the given
    // physical index in pq
    const updq = (alog, apos, blog, bpos) => {
        pq[alog] = apos;
        pq[blog] = bpos;
        qp[apos] = alog;
        qp[bpos] = blog;
    };

    /**
     * Insert item "element" at index "position" in the logical IPQ.
     *
     * If an item already exists at the given index, overwrite that item with
     * the new one.
     *
     * @param position Logical index to insert the element at
     * @param element The element to be inserted
     */
    this.insert = (position, element) => {
        if (position >  elements.length) {
            throw "Position " + position + " is too large; max elements = " + elements.length;
        }
        if (pq[position] != -1) {
            elements[pq[position]] = element;
        }
        else {
            elements[length] = element;
            pq[position] = length;
            qp[length++] = position;
        }
        // only one of these two should actually happen - if the first changes
        // the underlying PQ, the second should not, as neither swim nor sink
        // should modify the PQ unless they detect that the element at the given
        // position should be higher or lower depending on the size of its
        // parent or children
        this.swim(position);
        this.sink(position);
    };

    /**
     * Insert item "element" at the first available position.
     *
     * @param element The element to be inserted
     * @throws error if there are no available positions
     */
    this.push = (element) => {
        for (let i = 0; i < pq.length; i++) {
            if (pq[i] === -1) {
                this.insert(i, element);
                return;
            }
        }
        throw "Error pushing element: no room";
    };

    /**
     * Remove and return the highest priority element from the queue.
     *
     * @return the highest priority element
     */
    this.pop = () => {
        if (this.empty()) {
            throw "Error popping element: IPQ is empty";
        }
        --length;
        
        const ret = elements[0];
        elements[0] = elements[length];
        elements[length] = undefined;
        
        updq(qp[0], -1, qp[length], 0);
        
        this.sink(qp[0]);
        return ret;
    };

    /**
     * Check if there exists an element at the given (logical) index.
     *
     * @param position The logical index to check
     * @return true if there is an element at the position, false if there is
     * not or the position is invalid
     */
    this.elementAtIndex = (position) => {
        return position >= 0 && position < pq.length && pq[position] !== -1;
    };

    /**
     * Get the element at the given (logical) index.
     *
     * @param position The logical index to retrieve the element from
     * @return the element at the given position
     * @throws error if there is no such element at the given position
     */
    this.getElement = (position) => {
        if (!this.elementAtIndex(position)) {
            throw "Invalid position: " + position + ": no element";
        }
        return elements[pq[position]];
    };

    /**
     * @return true if the IPQ is empty, false otherwise
     */
    this.empty = () => {
        return length === 0;
    };

    /**
     * @return the number of elements currently in the IPQ
     */
    this.length = () => {
        return length;
    };

    /**
     * @return the number of elements the IPQ supports
     */
    this.capacity = () => {
        return capacity;
    };

    /**
     * While the element at logical index "position" is less than its parent,
     * let it "swim upwards".
     *
     * @param position The logical position of the element which should swim
     */
    this.swim = (position) => {
        let pos = pq[position]; // position is logical position, pos is physical position
        let p = Math.floor(pos/2);
        while (pos != 0 && less(elements[pos], elements[p])) {
            exch(p, pos);
            
            updq(position, p, qp[p], pos);

            pos = p; // next pos
            p = Math.floor(pos/2);
        }
    };

    /**
     * While either children of the element "position" is less than its parent,
     * let the element "sink" down, being replaced by the "lightest" of its
     * children.
     *
     * @param position The logical position of the element which should sink.
     */
    this.sink = (position) => {
        let pos = pq[position]; // position is logical position, pos is physical position
        while (2*pos < length) {
            let j = 2*pos;
            if (j+1 < length && less(elements[j+1], elements[j])) j++;
            if (!less(elements[j], elements[pos])) break;
            exch(j, pos);
            updq(position, j, qp[j], pos);
            pos = j;
        }
    };
}
