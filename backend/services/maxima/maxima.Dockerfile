FROM ubuntu:16.04

# helpfull links
# https://github.com/andrejv/maxima/blob/master/INSTALL
# https://github.com/maths/moodle-qtype_stack/blob/master/doc/en/Installation/Maxima.md
# https://translate.googleusercontent.com/translate_c?depth=1&hl=de&prev=search&pto=aue&rurl=translate.google.com&sl=en&sp=nmt4&u=https://github.com/hwborchers/rmaxima&usg=ALkJrhh-g32eFh6x0llvdonFEZ2TGJqQNA

# update and install dependencies
RUN apt-get update
RUN apt-get -y install texinfo
RUN apt-get -y install build-essential
RUN apt-get -y install sbcl
RUN apt-get -y install wget bzip2 autotools-dev time
RUN apt-get python3.3

# download and compile lisp (sbcl) from source
RUN wget http://downloads.sourceforge.net/project/sbcl/sbcl/1.3.1/sbcl-1.3.1-source.tar.bz2
RUN tar -x sbcl
RUN cd sbcl-1.3.1
RUN ./make-config.sh
RUN ./make.sh
RUN ./install.sh
RUN cd ..

# download and compile maxima from source
RUN wget https://sourceforge.net/projects/maxima/files/Maxima-source/5.44.0-source/maxima-5.44.0.tar.gz/download
RUN tar -xf download
RUN cd maxima-5.44.0
RUN ./configure --with-scbl
RUN make
RUN make install

CMD tail -f /dev/null