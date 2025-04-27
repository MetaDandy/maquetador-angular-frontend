export type StudioEditorProps = {
  pageID?: string;
}

export type RemoteMessage =
  | { type: "add"; component: any }
  | { type: "remove"; id: string }
  | { type: "update"; id: string; attributes: Record<string, any> } 
