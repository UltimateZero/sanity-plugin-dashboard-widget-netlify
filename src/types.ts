export interface SiteWidgetOption {
  apiId: string
  name?: string
  title: string
  buildHookId: string
  url?: string
  personalToken?: string
}
export interface WidgetOptions {
  title?: string
  description?: string
  sites: SiteWidgetOption[]
  personalToken?: string
}

export interface Site {
  title: string
  name?: string
  id: string
  url?: string
  adminUrl?: string
  buildHookId: string
  personalToken?: string
}

export interface Props {
  title?: string
  description?: string
  sites?: Site[]
  personalToken?: string
  isLoading: boolean
  onDeploy: DeployAction
}

export type DeployAction = (site: Site) => void
