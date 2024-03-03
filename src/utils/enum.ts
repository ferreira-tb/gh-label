export const enum Command {
  Clone = 'clone_labels',
  Create = 'create_label',
  Delete = 'delete_label',
  Edit = 'edit_label',
  IsLoggedIn = 'is_logged_in',
  List = 'list_labels'
}

export const enum StorageKey {
  Owner = 'gh-label:owner',
  Repository = 'gh-label:repository'
}
