FROM ubuntu:latest
LABEL authors="s.r.bulatov"

ENTRYPOINT ["top", "-b"]
