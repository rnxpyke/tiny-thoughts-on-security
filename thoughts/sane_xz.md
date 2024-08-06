# A sane solution for the XZ debacle

Recently, there was a huge discussion about the supply chain integrity of the XZ compression library.
[Here are the XZ maintainer notes on the incident.](https://tukaani.org/xz-backdoor/)

In short, a malicious actor managed to get changes to binary blobs into the XZ source tree.
These blobs contained an exploit payload that would be compiled into the library in specific build environments.
The exploit in question allowed for remote code execution on affected systems.

The malicious changes have been reverted since then, but online discourse focused on the ['Trusting Trust'](https://www.cs.cmu.edu/~rdriley/487/papers/Thompson_1984_ReflectionsonTrustingTrust.pdf) aspect of possible supply chain attacks in vital open source libraries.
Naturally, the trustworthiness of the was questioned quickly after the incident.

In the general case, it is very difficult to establish well founded trust towards suppliers or their software.

For security minded people, it is paramount to keep the Trusted Computing Base (TCB) as small as possible.
The [Bazaar style](http://www.catb.org/~esr/writings/cathedral-bazaar/cathedral-bazaar/index.html#catbmain) of software distribution in Open Source Software on the other hand leads to many participants of varying degrees of trust. 

A common way of establishing trust in Open Source software is the way of social proof.
Open Source maintainers gain trust by continuously producing (seemingly) well intentioned software. 
Reviewers can principally make well founded judgments on the nature of a particular change in software by reviewing the changed source code.
The source code doesn't lie. (Well, except if it does, see the "On Trusting Trust" Paper.)

In the real world however, people don't trust software projects like Linux because they have themselves reviewed the (million lines of) source code,
but because they trust in the judgments of other users and/or reviewers of the software, or even in the goodheartedness of the project lead themselves.
That is to say, people trust software, or the creators of software based on their feelings and the "vibes" they get from the project.

Sadly, the computer doesn't care about your feelings.

A maintainer that changes their minds about producing software for the benefit of the public (be it through bribes or other means),
or a maintainer that was simply tricked as was the case with the XZ project can introduce malicious code at any time.
The computer running the software doesn't know, and doesn't care if the software is malicious or not.


There exists, however, a large body of research under the name of cryptography dedicated to protecting our bits from untrusted computers (or humans, for that matter).
A cryptographer would typically phrase their research area in terms of (secret) messages, which are between trusted endpoints over untrusted channels.

And coincidentally, XZ is a compression algorithm.
For those who need a reminder, a compression algorithm's sole purpose is to reduce the size of a sequence of bytes, with the explicit restriction that we are able reconstruct the original sequence. 
With enough squinting of the eyes, this certainly seems like a communication channel to me.

We want to be certain to at least *detect* if a malicious actor changes the contents of our "message" under our hands.
In cryptographer speak, we want to detect any changes to the *integrity* of our message.

The simplest way to do this is to send a cryptographic hash like the SHA256 sum of the original message contents *out of band*. 

## Sane, secure compression, the spec

Let the *Message* be a arbitrary sequence of bytes.
Let the *Payload* be the result of any (\*) compression algorithm using the message as input. 

We choose a set of metadata to describe the message and compressed payload:

Mesage Metadata:
- Message Length (e.g. Count of Bytes, encoded in u64)
- Message Fingerprint (e.g. Sha256 of content)

Payload Metadata:
- Computational Bound (e.g. Time, Calculation steps, encoded in u64)
- Payload Length (e.g. Count of Bytes, encoded in u64)

A compressed object will look like this:

Header:
- Message Metadata
- Payload Metadata

Payload:
- (...bytes)


To compress a message, follow these steps:
- Calculate the Message Metadata
- Compress the Message using the Compression algorithm
- Record the time/steps needed to decompress the payload
- Encode Message Metadata, Payload Metadata, and Payload

To decompress a message, follow these steps:
- Set decompression limits from Payload Metadata
- Try to decompress the payload
  - If a decompression limit was hit, abort
- Calculate Fingerprint of decompressed message
- Compare Metadata of the decompressed message to the expected metadata
  - If metadata doesn't match, abort


(\*): The compression/decompression algorithm has to be run in a *pure* sandbox, like a docker container without I/O,
or a WebAssembly runtime.

If you follow these steps, you can run any compression algorithm, regardless of the trustworthiness of the authors,
because we have cryptographic evidence that the message wasn't tempered with.
(Meaning that any potential malicious actor has to break the hash function used to avoid detection of altered messages.)


## The bigger picture

Using the above proposal for compression headers, we could remove any past or future compression algorithm
from the trusted computing base, in exchange for a trusted runtime for pure & deterministic algorithms, like a WebAssembly runtime,
or a pure x86 emulator.

One could argue that replacing one program in the TCB with another is just moving the goalpost.
However, this scheme improves the bootstrapping of a TCB in two ways:
- We can replace a whole class of algorithms with a single "to be trusted" sandbox program
- It is likely that many other algorithms will benefit from the presence of a trusted sandbox.
  Thus, the "cost" of verifying the correctness of such a sandbox could be amortized over all such programs.


