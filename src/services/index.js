import {uploadPicsGroup, getPicsGroupList, deletePicGroup, downloadPicGroup,proxyWebSocket} from '../apis/index'
import Vue from 'vue'
export async function addPicsGroup (accountId,extId,name,pic,introduction) {
  let result = await uploadPicsGroup(accountId,extId,name,pic,introduction)
  return result
}

export async function getPicsGroup (extId,page,limit) {
  let result = await getPicsGroupList(extId,page,limit)
  return result
}

export async function deletePicsGroup (extId,name,file) {
  let result = await deletePicGroup(extId,name,file)
  return result
}

export async function downloadPicsGroup (extId,page,limit) {
  let result = await downloadPicGroup(extId,page,limit)
  return result
}

export async function webSocketProxy (api,username,password,platformId) {
  let result = await proxyWebSocket(api,username,password,platformId)
  return result
}