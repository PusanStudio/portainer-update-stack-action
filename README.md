# portainer-update-stack-action
 Update Portainer Stack with Portainer-CE API

## Example usage

```yaml
uses: PusanStudio/portainer-update-stack-action@main
with:
  portainer-url: ${{ secrets.PORTAINER_URL }}
  portainer-api-key: ${{ secrets.PORTAINER_API_KEY }}
  portainer-endpoint: 1
  portainer-stack: 1
```