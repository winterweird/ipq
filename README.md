# IPQ: An index priority queue implementation in JavaScript

NOTE: Credit for original implementation of an "indexed priority queue" as best
as I can tell goes to https://algs4.cs.princeton.edu/ (or at least, it appears
that this is where the name came from, since all attempts at googling "index
priority queue" trace back to here). Consider this somewhere between an
adaptation and an interpretation of [the concepts and techniques described
here](https://algs4.cs.princeton.edu/24pq/).

## Usage:

You can use the code as it is or with any modifications you'd like by somehow
including it in your project. I don't really know about the best practices for
web development, so I just created a function named IndexPriorityQueue with a
set of functions as its API. Do with it what you'd like.

If the user uses the API of the IPQ in a reasonable way, the data invariants
should be preserved. There is some bare-bones error handling, but no type checks
or anything fancy.

The API is described in JavaDoc style comments in the code (`ipq.js`). I might
also get around to producing some actual documentation later, or maybe not.

## Example use

```js
// Construct the IPQ
let ipq = new IndexPriorityQueue(16);
for (let i = 0; i < ipq.capacity(); i++) {
    ipq.push(Math.random());
}

// Insert lower/upper bounds at indexes 0 and 1
ipq.insert(0, 0);
ipq.insert(1, 1);

while (!ipq.empty()) {
    // should output 0, followed by a bunch of random numbers in [0..1]
    // (in order), followed by 1
    console.log(ipq.pop());
}
```

## Yeah, yeah, but _why_?

Admittedly, you don't need to use an IPQ all the time. Often it's enough to just
use a normal priority queue, or some other data structure. However, it's
occasionally useful - for instance, it's possible to implement Prim's eager
algorithm using an IPQ, as also described by Algorithms, which may be useful if
you have a ridiculous amount of edges in your graph. Also, probably some other
stuff. I dunno.

Actually, the reason I made it in the first place was that my friend needed to
compute the MST of some big graph, and couldn't find any implementation of this
online. It turned out he didn't need to use the eager algorithm in the end, but
I made it nonetheless, as it was a fun diversion.

So, here it is, I guess. I dunno. Take it for what it's worth.

#### Hours wasted on this project: probably somewhere around 3
