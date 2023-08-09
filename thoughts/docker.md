# Docker and the Wrong Abstraction

The typical usage of Docker looks like this:
You select some base Image, probably Alpine, Debian or Ubuntu, and then
run commands inside the container to include your code and any dependencies.
Nobody wants to manage their dependencies themselves, of course.
This is especially true for packages from your Linux distribution.
So the logical step is to just run the equivalent of `apt install` in your container.

In a sense, building a docker image is just building more abstractions on top of the existing
packaging solutions. As with all things, there are some pros and cons to this approach.

Pros:
- Containers with Alpine Base Image on Debian and vice versa.
- There are no conflicts with peer dependencies between containers.

Cons:
- You forfeit reproducible builds when using IO inside your Dockerfile.
  The typical `apt install` accesses the network to install the latest package version.
  Rebuilding the Container Image at a later might include different package versions.
- Dockerfile build steps are linear.
  If you include two packages in your image by running `apt install` once, and want to update first package,
  you also have to rebuild the second, even when they have nothing in common.

These issues are somewhat orthogonal to the real reason why you want to use containers:
To isolate system components.

I don't think that Dockerfiles and Layered Images are needed at all.
A simple archive of all files included in the image should be enough.
The benefits of using layered images only comes into play when you have many (big) images, which share
common components, like the base image.

But the package manager already is a pretty good tool for reducing the disc usage with shared dependencies.
If the layout of the file system is inverted, packages could be used directly within containers.

Instead of structuring the file system like this:
```
/
- bin/
  - pkg1.bin
  - pkg2.bin
- share/
  - pkg1.lib
  - pkg2.lib 
```

It should look like this:
```
/
- pkgs/
  - pkg1/
    - bin/pkg1.bin
    - share/pkg1.lib
  - pkg2/
    - bin/pkg2.bin
    - share/pkg2.lib
```
Basically, instead of dumping the packages in a global file system, each package lives in its own folder.
With this layout, it is possible to 'install' the same package in different versions at the same time,
or even use different package managers altogether.

If you want to pin a package version, you just need to create a lock file with the package version number and 
hash. This is something that package managers like NPM and Cargo already do.
