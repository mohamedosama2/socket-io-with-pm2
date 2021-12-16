const _ = require('lodash');
const mongoose = require('mongoose');
const mongooseAutoIncrement = require('mongoose-auto-increment');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

module.exports = (modelName, schema, options = {}) => {
  // parse id to int
  schema.virtual('id').get(function () {
    return parseInt(this._id);
  });

  // static methods
  if (options.paginate !== false) {
    schema.statics.fetchAll = function (paginate = true, ...args) {
      if (!paginate) return this.find(args[0], null, args[1]);
      return this.paginate(args[0], args[1]);
    };
  }


  // req.allowpagination => boolean , arg[0] => query filter , arg[1] => queryOptions : sort ,populate , page ,select
  // so paginate(queryFilter , queryOption)

  // general toJSON response
  // if (options.responseFunc && typeof options.responseFunc === 'function') {
  //   schema.set('toJSON', {
  //     virtuals: true,
  //     transform: function (doc, ret, opts) {
  //       let response = options.responseFunc(doc, opts);
  //       let hide = opts.hide;
  //       let show = opts.show;
  //       if (hide) {
  //         if (typeof hide === 'string') _.set(response, hide, undefined);
  //         else if (hide instanceof Array)
  //           hide.forEach(field => _.set(response, field, undefined));
  //       }
  //       if (show) {
  //         if (typeof show === 'string') _.set(response, show, _.get(doc, show));
  //         else if (show instanceof Array)
  //           show.forEach(field => _.set(response, field, _.get(doc, field)));
  //       }
  //       return response;
  //     }
  //   });
  // }
  // general toJSON response
  if (options.responseFunc && typeof options.responseFunc === 'function') {
    schema.set('toJSON', {
      virtuals: true,
      transform: function (doc, ret, opts) {
        let response = options.responseFunc(doc, opts);
        let hide = opts.hide;
        let show = opts.show;
        let append = opts.append;
        if (hide) {
          if (typeof hide === 'string') _.set(response, hide, undefined);
          else if (hide instanceof Array)
            hide.forEach(field => _.set(response, field, undefined));
        }
        if (show) {
          if (typeof show === 'string') _.set(response, show, _.get(doc, show));
          else if (show instanceof Array)
            show.forEach(field => _.set(response, field, _.get(doc, field)));
        }
        if (append) {
          if (append instanceof Object) {
            for (let key in append) {
              const value = append[key];
              if (value instanceof Object) response[key] = doc[value.ref];
              else response[key] = value;
            }
          }
        }
        return response;
      }
    });
  }

  // plugins
  if (options.autoIncrement !== false) {
    mongooseAutoIncrement.initialize(mongoose.connection);
    schema.plugin(mongooseAutoIncrement.plugin, {
      model: modelName,
      startAt: 1,
      // field: 'id'
    });
  }
  if (options.softDelete !== false) {
    schema.plugin(mongooseDelete, { overrideMethods: true });
  }
  if (options.paginate !== false) {
    schema.plugin(mongoosePaginate);
  }

  schema.plugin(mongooseLeanVirtuals);


  return schema;
};
