# The Confused Deputy

Original Reference:
[Norm Hardy. 1988.
The Confused Deputy: (or why capabilities might have been invented).
SIGOPS Oper. Syst. Rev. 22, 4 (Oct. 1988), 36–38.
](https://doi.org/10.1145/54289.871709)

The Confused Deputy exemplifies the issue of ambient authority.
The original confused Deputy is a compiler on a multi-user system.
It has the authority to access the users source files and the operators
billing statistics.

A user can specify the location where they expect the compiler to put the finished
binary. By specifying the path of the billing file, they can get the compiler to
overwrite the billing info.

The compiler is confused when to wield which authority.
It can't differentiate when to open the billing file on the operator's behalf versus
the source files on the user's behalf.

Nowadays, a confused deputy arises anytime an actors ambient authority consists
of the union of delegated authority from two or more principals.

That's a lot of fancy words to say:
A lot of programs can be fooled using the same pattern.

A more recent example is the X11 Server that is used on Linux machines to do graphics.
For reasons, the server is run with root privileges, but can be started by typical users.
Users can also specify the location for the log file of the server.
Naturally, it was possible to overwrite the /etc/passwd and /etc/shadow file responsible
for storing user passwords. A user could then gain root access by adding a new user
by manipulating the server logs. [Details](https://www.rapid7.com/db/modules/exploit/aix/local/xorg_x11_server/)

That is not to say that the issue of distinguishing authority can't be solved.
One merely has to rid themselves of [ambient authority](./authority.md).