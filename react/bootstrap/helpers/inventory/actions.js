export const exec_action = function(item_id, image, e) {
  e.preventDefault();
  let { project_data } = this.props;
  let { insert_item, request_remove_item } = this.context;
  let { previosSibling, firstChild, parentNode } = e.currentTarget;

  if( project_data ) {
    if( !project_data.page ) {
      firstChild.className = 
        firstChild.className === 'icon icon-add' ? 'icon icon-remove' : 'icon icon-add';
        parentNode
          .firstChild
            .style
              .display = parentNode.firstChild.style.display ===  'block' ? 'none': 'block';
      if(_.isFunction(insert_item)) {
        insert_item(item_id, image);
      }
    } else {
      if(_.isFunction(request_remove_item)) {
        request_remove_item(item_id);
      }
    }
  } else {
    previousSibling
      .style
        .display = previousSibling.style.display ===  'block' ? 'none': 'block';
  }
};

export const add_to_project = function(e) {
  e.preventDefault();
  let { _id } = this.props;
  this.context.update_project(this.refs.project_id.value, _id);
  this.context.set_add_to_project(_id, parseInt(this.refs.project_id.value));
    
}