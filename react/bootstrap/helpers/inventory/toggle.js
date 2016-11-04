/**
 * toggleClass function
 * @param  {string} type Status of the item e.g. available, checkedout, inlocation 
 * @param  {object} e    Event
 * @return {function}    Activate animation for the selected type
 */
export const toggleClass = (type, e) => {
  e.preventDefault();

  let controller = {
  	available: {
  		animation() {
			  let { firstChild, parentNode } = e.currentTarget;
			  firstChild
			    .className = 
			      firstChild.className === 'icon icon-add' ? 'icon icon-remove' : 'icon icon-add'
			  parentNode
			    .parentNode.classList.toggle('active');
  		}
  	},
  	checkedout: {
  		animation() {
				let { firstChild, parentNode } = e.currentTarget;
				firstChild
				  .className = 
				    firstChild.className === 'icon icon-add' ? 'icon icon-remove' : 'icon icon-add'
				parentNode
				  .parentNode.parentNode.classList.toggle('active');
			}
		},
		inlocation: {
			animation() {
				let { firstChild, parentNode } = e.currentTarget;
				firstChild
				  .className = 
				    firstChild.className === 'icon icon-add' ? 'icon icon-remove' : 'icon icon-add'
				parentNode
				  .parentNode.parentNode.classList.toggle('active');
			}
		}
  }

  return controller[type].animation();

};

export const toggleLocation = (type, e) => {
  e.preventDefault();
  let { parentNode } = e.currentTarget;
 
  e.currentTarget.firstChild.className = e.currentTarget.firstChild.className === 'icon icon-' + type ? 'icon icon-remove': 'icon icon-' + type;
  parentNode
    .parentNode
      .parentNode.firstChild.classList.toggle('active');
}