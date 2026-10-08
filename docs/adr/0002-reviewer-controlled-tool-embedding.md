# Reviewers control tool embedding

Each published tool has a dedicated hub page, with embedding when permitted and an external link otherwise. Submitters provide the tool URL; reviewers select an embedding URL, which must use HTTPS and an explicitly approved domain. Reviewer approval alone does not authorize arbitrary embedded origins: this trades unrestricted embedding for a controlled boundary around third-party tools. Implementing native tools is outside issue #3.

Manage approved embedding domains in the backend database using exact hostnames, so reviewers can approve new origins without a code deployment. Load an iframe only after a visitor chooses to open the tool, and always keep the external link available.
