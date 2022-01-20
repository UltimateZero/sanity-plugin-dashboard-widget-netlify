import React, {FunctionComponent, useCallback, useEffect, useRef, useState} from 'react'
import {Button, Flex, Box, Card, Text, Stack, Label} from '@sanity/ui'
import {DeployAction, Site} from '../../types'
import Links from './Links'

interface Props {
  site: Site
  personalToken?: string
  onDeploy: DeployAction
}

interface CommitResult {
  commitRef: string
  updatedAt: string
}

export const IMAGE_PULL_INTERVAL = 10000
export const COMMIT_PULL_INTERVAL = 60000

const getCommit = (siteId: string, personalToken?: string): Promise<CommitResult> => {
  let commitResult: CommitResult = {commitRef: '', updatedAt: ''}
  if (!personalToken) return new Promise((resolve) => resolve(commitResult))
  const url = `https://api.netlify.com/api/v1/sites/${siteId}/deploys`
  const headers = {
    authorization: `Bearer ${personalToken}`,
  }
  return fetch(url, {method: 'get', headers}).then((resp) => {
    return resp.json().then((json) => {
      const latestCommit = json.find((deploy: any) => !!deploy.commit_ref)
      const latestDeploy = json[0]
      const timestamp = new Date(latestDeploy.updated_at)
      commitResult = {
        commitRef: latestCommit.commit_ref.substr(0, 7),
        updatedAt: timestamp.toLocaleString(),
      }
      return commitResult
    })
  })
}

const getImageUrl = (siteId: string) => {
  const baseUrl = `https://api.netlify.com/api/v1/badges/${siteId}/deploy-status`
  const time = new Date().getTime()

  return `${baseUrl}?${time}`
}

const useBadgeImage = (siteId: string) => {
  const [src, setSrc] = useState(() => getImageUrl(siteId))
  const update = useCallback(() => setSrc(getImageUrl(siteId)), [siteId])

  useEffect(() => {
    const interval = window.setInterval(update, IMAGE_PULL_INTERVAL)
    return () => window.clearInterval(interval)
  }, [update])

  return [src, update] as const
}

const useCommit = (siteId: string, personalToken?: string) => {
  if (!personalToken) return []
  const [commit, setCommit] = useState({commitRef: '', updatedAt: ''})
  const update = useCallback(async () => {
    return getCommit(siteId, personalToken).then((resp: CommitResult) => {
      if (!resp.commitRef) return
      setCommit(resp)
    })
  }, [siteId, personalToken])

  useEffect(() => {
    const interval = window.setInterval(update, COMMIT_PULL_INTERVAL)
    return () => window.clearInterval(interval)
  }, [update])
  return [commit, update] as const
}

const useDeploy = (
  site: Site,
  onDeploy: DeployAction,
  updateBadge: () => void,
  updateCommit: () => void
) => {
  const timeoutRef = useRef(-1)
  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  const timeoutCommitRef = useRef(-1)
  useEffect(() => () => window.clearTimeout(timeoutCommitRef.current), [])

  return useCallback(() => {
    onDeploy(site)
    timeoutRef.current = window.setTimeout(() => {
      updateBadge()
      updateCommit()
    }, 1000)
  }, [site, onDeploy, updateBadge, updateCommit])
}

const SiteItem: FunctionComponent<Props> = (props) => {
  const [hasBadgeError, setHasBadgeError] = useState(false)
  const {site, onDeploy, personalToken} = props
  const {id, name, title, url, adminUrl, buildHookId} = site

  const [badge, updateBadge] = useBadgeImage(id)
  const [commit, updateCommit] = useCommit(id, personalToken)
  const handleDeploy = useDeploy(site, onDeploy, updateBadge, updateCommit)
  const handleBadgeError = () => {
    setHasBadgeError(true)
  }

  useEffect(() => {
    const fetchCommit = async () => updateCommit()
    fetchCommit()
  }, [updateCommit])

  return (
    <Flex as="li">
      <Box flex={1} paddingY={2} paddingX={3}>
        <Stack space={3}>
          <Text as="h4">
            {title || name}
            <Links url={url} adminUrl={adminUrl} />
          </Text>
          {commit.commitRef ? (
            <React.Fragment>
              <Text as="span">
                &nbsp;Commit: <strong>{commit.commitRef}</strong>
              </Text>
              <Text as="span">&nbsp;Last deploy was on ({commit.updatedAt})</Text>
            </React.Fragment>
          ) : (
            null
          )}
          <Flex justify="flex-start">
            {!hasBadgeError && <img src={badge} onError={handleBadgeError} alt="Badge" />}
            {hasBadgeError && (
              <Card tone="critical" radius={2} padding={2}>
                <Label size={0} muted>
                  Failed to load badge
                </Label>
              </Card>
            )}
          </Flex>
        </Stack>
      </Box>

      {buildHookId ? (
        <Box paddingY={2} paddingX={3}>
          <Button mode="ghost" onClick={handleDeploy} text="Deploy" />
        </Box>
      ) : null}
    </Flex>
  )
}

export default SiteItem
