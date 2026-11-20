FROM python:3.12-alpine
WORKDIR /app
RUN apk add --no-cache git
COPY .claude /app/.claude
COPY templates /app/templates
ENV CLAUDE_INVOKED_BY=docker
CMD ["sleep", "infinity"]
