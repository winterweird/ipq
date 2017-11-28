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
    this.elements = new Array(size);    // is a priority queue
    this.pq = new Array(size).fill(-1); // at logical index i, store j = physical index in this.elements
    this.qp = new Array(size).fill(-1); // at physical index i, store j = logical index in IPQ
    
    this.length = 0;
    this.capacity = size;
    
    // custom comparator?
    if (less !== undefined)
        this.less = less;
    else
        this.less = (a,b) => {
            return a < b;
        };
    
    // helper function: exchange elements at index a and b
    const exch = (a,b) => {
        const tmp = this.elements[a];
        this.elements[a] = this.elements[b];
        this.elements[b] = tmp;
    }

    // helper function: update pq and qp such that the physical index points to
    // the given logical index in qp, and the logical index points to the given
    // physical index in pq
    const updq = (alog, apos, blog, bpos) => {
        this.pq[alog] = apos;
        this.pq[blog] = bpos;
        this.qp[apos] = alog;
        this.qp[bpos] = blog;
    }

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
        if (position >  this.elements.length) {
            throw "Position " + position + " is too large; max elements = " + this.elements.length;
        }
        if (this.pq[position] != -1) {
            this.elements[this.pq[position]] = element;
        }
        else {
            this.elements[this.length] = element;
            this.pq[position] = this.length;
            this.qp[this.length++] = position;
        }
        const pos = this.pq[position];
        const p = Math.floor(pos/2);
        if (pos !== 0 && this.less(this.elements[pos], this.elements[p])) {
            this.swim(position);
        }
        else if (this.elementAtIndex(2*pos)) {
            this.sink(position);
        }
        // else: do nothing
    }

    /**
     * Insert item "element" at the first available position.
     *
     * @param element The element to be inserted
     * @throws error if there are no available positions
     */
    this.push = (element) => {
        for (let i = 0; i < this.pq.length; i++) {
            if (this.pq[i] === -1) {
                this.insert(i, element);
                return;
            }
        }
        throw "Error pushing element: no room";
    }

    /**
     * Remove and return the highest priority element from the queue.
     *
     * @return the highest priority element
     */
    this.pop = () => {
        if (this.empty()) {
            throw "Error popping element: IPQ is empty";
        }
        --this.length;
        
        const ret = this.elements[0];
        this.elements[0] = this.elements[this.length];
        this.elements[this.length] = undefined;
        
        updq(this.qp[0], -1, this.qp[this.length], 0);
        
        this.sink(this.qp[0]);
        return ret;
    }

    /**
     * Check if there exists an element at the given (logical) index.
     *
     * @param position The logical index to check
     * @returns true if there is an element at the position, false if there is
     * not or the position is invalid
     */
    this.elementAtIndex = (position) => {
        return position >= 0 && position < this.pq.length && this.pq[position] !== -1;
    }

    /**
     * Get the element at the given (logical) index.
     *
     * @param position The logical index to retrieve the element from
     * @returns the element at the given position
     * @throws error if there is no such element at the given position
     */
    this.getElement = (position) => {
        if (!this.elementAtIndex(position)) {
            throw "Invalid position: " + position + ": no element";
        }
        return this.elements[this.pq[position]];
    }

    /**
     * @return true if the IPQ is empty, false otherwise
     */
    this.empty = () => {
        return this.length === 0;
    }

    /**
     * While the element at logical index "position" is less than its parent,
     * let it "swim upwards".
     *
     * @param position The logical position of the element which should swim
     */
    this.swim = (position) => {
        let pos = this.pq[position]; // position is logical position, pos is physical position
        let p = Math.floor(pos/2);
        while (pos != 0 && this.less(this.elements[pos], this.elements[p])) {
            exch(p, pos);
            
            updq(position, p, this.qp[p], pos);

            pos = p; // next pos
            p = Math.floor(pos/2);
        }
    }

    /**
     * While either children of the element "position" is less than its parent,
     * let the element "sink" down, being replaced by the "lightest" of its
     * children.
     *
     * NOTE: There should be a way easier way to do this
     *
     * @param position The logical position of the element which should sink.
     */
    this.sink = (position) => {
        let pos = this.pq[position]; // position is logical position, pos is physical position
        let posNotFound = true;
        while (posNotFound) {
            const l = 2*pos; const r = 2*pos+1;
            if (this.elementAtIndex(this.qp[l])) {
                if (!this.elementAtIndex(this.qp[r])) {
                    if (this.less(this.elements[l], this.elements[pos])) {
                        exch(l, pos);
                        updq(position, l, this.qp[l], pos);
                        pos = l;
                    }
                    else {
                        posNotFound = false; // don't sink further
                    }
                }
                else if (this.less(this.elements[l], this.elements[r])) {
                    if (this.less(this.elements[l], this.elements[pos])) {
                        exch(l, pos);
                        updq(position, l, this.qp[l], pos);
                        pos = l;
                    }
                    else {
                        posNotFound = false; // don't sink further
                    }
                }
                else if (this.less(this.elements[r], this.elements[pos])) {
                    exch(r, pos);
                    updq(position, r, this.qp[r], pos);
                    pos = r;
                }
                else {
                    posNotFound = false; // don't sink further
                }
            }
            else {
                posNotFound = false; // at leaf node
            }
        }
    }
}
