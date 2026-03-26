import mongoose from 'mongoose'

const childMenuSchema = new mongoose.Schema({
  index: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  path: {
    type: String,
    required: true,
    trim: true,
  },

})


const navigateSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  index: {
    type: Number
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  path: {
    type: String,
    required: true,
    trim: true,
  },
  childMenu: {
    type: [childMenuSchema],
    default: [],
  }
})

navigateSchema.index({ owner: 1, path: 1 }, { unique: true });
navigateSchema.index({ owner: 1, name: 1 }, { unique: true });

navigateSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const lastItem = await this.constructor
        .findOne({ owner: this.owner })
        .sort({ index: -1 })

      this.index = lastItem && lastItem.index ? lastItem.index + 1 : 1

    } catch (err) {
      throw err
    }
  }
})


const navigateModel = mongoose.model('Navigate', navigateSchema)

export default navigateModel