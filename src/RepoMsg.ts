import { Patch, Change } from 'automerge'
import { PublicMetadata } from './Metadata'
import { DocId, HyperfileId, ActorId } from './Misc'
import { PublicId, SecretId } from './Keys'

export type ToBackendQueryMsg = MaterializeMsg | MetadataMsg

export type ToFrontendReplyMsg = MaterializeReplyMsg | MetadataReplyMsg

export type ToBackendRepoMsg =
  | NeedsActorIdMsg
  | RequestMsg
  | CloseMsg
  //  | FollowMsg
  | MergeMsg
  | CreateMsg
  | OpenMsg
  | DocumentMsg
  | DestroyMsg
  | DebugMsg
  | QueryMsg
//  | MaterializeMsg

export interface QueryMsg {
  type: 'Query'
  id: number
  query: ToBackendQueryMsg
}

export interface ReplyMsg {
  type: 'Reply'
  id: number
  payload: any // PublicMetadata | Patch
  //  reply: ToFrontendReplyMsg;
}

export interface MaterializeMsg {
  type: 'MaterializeMsg'
  id: DocId
  history: number
}

export interface MetadataMsg {
  type: 'MetadataMsg'
  id: DocId | HyperfileId
}

export interface CreateMsg {
  type: 'CreateMsg'
  publicKey: PublicId
  secretKey: SecretId
}

export interface MergeMsg {
  type: 'MergeMsg'
  id: DocId
  actors: string[] // ActorId | `${ActorId}:${seq}` (result of clock2strs function)
}

/*
export interface FollowMsg {
  type: "FollowMsg";
  id: string;
  target: string;
}
*/

export interface DebugMsg {
  type: 'DebugMsg'
  id: DocId
}

export interface OpenMsg {
  type: 'OpenMsg'
  id: DocId
}

export interface DestroyMsg {
  type: 'DestroyMsg'
  id: DocId
}

export interface NeedsActorIdMsg {
  type: 'NeedsActorIdMsg'
  id: DocId
}

export interface RequestMsg {
  type: 'RequestMsg'
  id: DocId
  request: Change
}

export type ToFrontendRepoMsg =
  | PatchMsg
  | ActorBlockDownloadedMsg
  | ActorIdMsg
  | ReadyMsg
  | ReplyMsg
  | DocumentMsg
  | FileServerReadyMsg

export interface PatchMsg {
  type: 'PatchMsg'
  id: DocId
  minimumClockSatisfied: boolean
  patch: Patch
  history: number
}

export interface DocumentMsg {
  type: 'DocumentMessage'
  id: DocId
  contents: any
}

export interface MaterializeReplyMsg {
  type: 'MaterializeReplyMsg'
  patch: Patch
}

export interface MetadataReplyMsg {
  type: 'MetadataReplyMsg'
  metadata: PublicMetadata | null
}

export interface ActorIdMsg {
  type: 'ActorIdMsg'
  id: DocId
  actorId: ActorId
}

export interface CloseMsg {
  type: 'CloseMsg'
}

export interface ReadyMsg {
  type: 'ReadyMsg'
  id: DocId
  minimumClockSatisfied: boolean
  actorId?: ActorId
  patch?: Patch
  history?: number
}

export interface ActorBlockDownloadedMsg {
  type: 'ActorBlockDownloadedMsg'
  id: DocId
  actorId: ActorId
  index: number
  size: number
  time: number
}

export interface FileServerReadyMsg {
  type: 'FileServerReadyMsg'
  path: string
}
