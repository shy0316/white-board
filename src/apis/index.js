import { Api } from '../common/index'
export function uploadPicsGroup (accountId,extId,name,pic,introduction) {
  return Api.call('admin.whiteboard.uploadPicGroup', {
    accountId,
    extId,
    name,
    pic,
    introduction
  })
}

export function getPicsGroupList (extId,page,limit) {
  return Api.call('admin.whiteboard.picGroupList', {
    extId,
    page,
    limit
  })
}

export function deletePicGroup (picGroupId) {
  return Api.call('admin.whiteboard.delPicGroup', {
    picGroupId
  })
}

export function downloadPicGroup (picGroupId) {
  return Api.call('admin.whiteboard.downloadPicGroup', {
    picGroupId
  })
}

export function proxyWebSocket (api,username,password,platformId) {
  return Api.call('admin.whiteboard.proxyWebSocket', {
    api,
    username,
    password,
    platformId
  })
}