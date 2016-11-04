export const IMAGE_UPLOAD = {
  images: {
    tag: 'input',
    type: 'file',
    group: null,
    className: '',
    label: 'images',
    placeholder: 'images'
  }
}

export const TAGS = {
  categories: {
    tag: 'input',
    type: 'file',
    group: null,
    className: '',
    label: 'categories',
    placeholder: 'categories',
    required: true
  },
  styles: {
    tag: 'input',
    type: 'file',
    group: null,
    className: '',
    label: 'styles',
    placeholder: 'styles',
    required: false
  },
  palletes: {
    tag: 'input',
    type: 'file',
    group: null,
    className: '',
    label: 'palletes',
    placeholder: 'palletes',
    required: false
  },
  rooms: {
    tag: 'input',
    type: 'file',
    group: null,
    className: '',
    label: 'rooms',
    placeholder: 'rooms',
    required: false
  }
}

export const SUFFIX_BOTTOM = {
  retailer: {
    tag: 'input',
    type: 'text',
    label: 'retailer',
    group: 'last-bottom',
    className: 'col-md-6',
    placeholder: 'retailer',
  },
  brand: {
    tag: 'input',
    type: 'text',
    label: 'brand',
    group: 'last-bottom',
    className: 'col-md-6'
  }
}

export const ORPHANED_FIELD = {
  description: {
    tag: 'textarea',
    group: 'item-details-bottom',
    label: 'Description',
    className: 'col-md-12',
    placeholder: 'description'
  }
}

export const TOP_PRODUCT = {
 name: {
    tag: 'input',
    type: 'text',
    label: 'name',
    className: 'col-md-6',
    placeholder: 'name'
  },
  itemCount: {
    tag: 'input',
    type: 'text',
    group: 'item-details-top',
    className: 'col-md-3',
    label: 'itemCount'
  },
  _id: {
    tag: 'input',
    type: 'text',
    label: 'itemCount',
    className: 'col-md-3',
    placeholder: 'itemCount'
  }
}

export const PREFIX_BOTTOM = {
  purchaseDate: {
    tag: 'input',
    type: 'text',
    group: 'first-bottom',
    label: 'purchaseDate',
    className: 'col-md-6',
    placeholder: 'purchase Date'
  },
  price: {
    tag: 'input',
    type: 'number',
    group: 'first-bottom',
    label: 'price',
    className: 'col-md-6',
    placeholder: 'price',
  }
};