# On Global State

At the first day Church said let there be [lambdas](https://en.wikipedia.org/wiki/Lambda_calculus). 
And he saw that it was not good enough, but anyways, there is now some basis for computation.
At the second day, Turing said:
"I need a machine to compute.
Let's call it a [Turing Machine](https://en.wikipedia.org/wiki/Turing_machine).
And by the way, it's equivalent to the Lambda Calculus."
And so it was that we have state in computers.

Well, that's not quite how it happened, but close enough.
The fact remains, that the idea of a bunch of state in a row stuck.
So much, that 'randomly' addressable memory is a given on basically any computer.

Early languages gave the programmers direct access to the underlying memory.
This has led to many buffer overflows and is generally regarded as a bad move.

The need for memory protection is so obvious that most popular languages don't let you
talk about it at all.
In Python, Java and JavaScript you can use memory by creating objects.
An object consists of data and behaviour, both of which are typically given names.
Accessing memory outside of the objects accessible to the current scope is impossible,
as it should be. (Note from the Editor: Insert bit about FFI here).

The addition of objects necessitates the differentiation of local and global state.
As everyone else has probably told you already, global mutable state is bad.
In the case of C and it's buffer overflows that statement should be pretty obvious.

But you, dear reader, might not be immediately convinced that the same is true for
the newer languages. After all, I've just told you how memory accesses outside of
reachable objects is impossible. So let's consider a little example.

I have a secret.
Actually, I have a few secrets.
If you want to know which, you have to guess!

```javascript
function makeSecretContainer(...secrets) {
  let tries = 3;
  const guess = (arg) => {
    if (tries <= 0) {
      throw new Error('no more guesses!');
    }
    tries -= 1;
    return secrets.includes(arg);
  };
  return guess;
}

const guess = makeSecretContainer(/* my secrets */);
```

Do you think you can guess my secrets with just 3 tries?
Probably not. If I have more than 3 secrets, certainly not.

But can you still get access to all my secrets?
(Given that this whole example should demonstrate unintended behaviour,
the answer should obviously be yes, the actual question is only: how?)

Hint 1: `secrets.includes(arg)` is equal to `Array.prototype.includes.call(secrets, arg)`

Hint 2: `Array.prototype` is global and mutable by default

Solution:

```javascript
const originalIncludes = Array.prototype.includes;

let stolenSecrets;
Array.prototype.includes = function () {
	stolenSecrets = this;
}

guessSecrets();

Array.prototype.includes = originalIncludes;
console.log(stolenSecrets);
```

Similar exploits can be done with any other global object.

How do we fix the issue?
Simple: We just `Object.freeze(Array.prototype)`.
After freezing the prototype, the object is immutable.
Calling functions and reading props is still possible, but we can't override the methods
with our own custom methods.

A variable can either be global, or mutable, but not both.