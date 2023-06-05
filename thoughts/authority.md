# Freedoms, Rights and (digital) Ownership

Humans are selfish.
Although we value abstract things like freedom, often we want to restrict the freedom of others.
Suppose you are writing a diary. You propably don't want your parents snooping on it.

More generally, we recognize that humans can own things.
Ownership boils down to having exclusive freedom over something. Like Money.
In simple terms, you expect that other people can't take away things you own.
Or at least that they'd be punished if they do.

With a computer system, the story is a little different.
Data isn't lost when somebody else reads it.
Other people can't *take* digital objects from you.
Still, you probably won't give your diary away to everyone just because it is digital.

Consider authority to be the digital form of ownership.
Computers can enforce authority through sandboxed environments and cryptography.

Consider the following scenario:
You have some collection of digital data.
You organize your data in chunks.
Let's call these chunks files.
Files can be organized by name in a hierachical file system.
Others should not be able to access your files.
You store your data on a system by providing some kind of secret credentials.
The file system remembers that you are the owner of your files.
You can then access your data by identifing yourself and running a program that operates on your data.
The computer associates the program with your user identifier.
The program can access the files by invoking `read(filename)` or `write(filename)` operations.
To make sure that the program has the authority to access a file,
The system checks if the user that started the program is owner of the requested file.

In this senario, the program isn't aware of it's authority.
(That is, unless it is denied access to a file because it lacks authority).
Ownership and authority are enforced by the ambient system on behalf of the user and their program.
This system is therefore an example of so called ambient authority.

Ambient authority isn't the only way to check access rights to resources.
Let's augment the above example to make the transfer of authority explicit.
As before, we have files. Only authorized users (or programs) should be able to access files.
Imagine the file system as a wall of lockers or bank vaults.
Reading and writing to a file can be done only if you have the key to the corresponding locker.
A directory is a locker containing keys to other lockers.

As before, we have the user, some arbitrary programs, and the file system.
The user is authorized to access their files because they have the key to the files they created.
When the user wants to interact with their files, they start a program with the keys to the files they need.
The program can then operate on the files by sending `read(key)` or `write(key)` requests to the filesystem.

Notice that there is no third party checking access rights based on user identities.
We have removed ambient authority based on user-ids from our system.

This 'file key' also exists on common POSIX systems: It's called a file descriptor.