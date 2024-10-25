import {ulid} from 'ulid';
import Coordinates from './Coordinates';
import Size from './Size';

/**
 * @class Node
 */
export default class Node {
  static PORT_HEIGHT = 18;

  id = null;
  title = null;
  category = null;
  deletable = null;
  color = null;
  /**
   * @type {Size}
   */
  size = null;
  /**
   * @type {Coordinates}
   */
  coordinates = null;

  data = {}; // user object

  portsIn = {
    // default: { type: 'text', value: '' }
  };
  portsOut = {
    // default: { type: 'text', value: '' }
  };

  /**
   * @param  {String} attr.id
   * @param  {String} attr.title
   * @param  {Coordinates} attr.coordinates
   * @param  {Size} attr.size
   * @param  {Object} attr.portsIn
   * @param  {Object} attr.portsOut
   * @param  {Object} attr.category
   * @param  {Object} attr.color
   * @param  {Object} attr.deletable
   */
  constructor(attr) {
    this.id = Node.prepareProp('id', attr.id);
    this.title = attr.title;
    this.category = Node.prepareProp('category', attr.category);
    this.deletable = Node.prepareProp('deletable', attr.deletable);
    this.coordinates = Node.prepareProp('coordinates', attr.coordinates);
    this.color = Node.prepareProp('color', attr.color);
    this.size = Node.prepareProp('size', attr.size);
    this.data = Node.prepareProp('data', attr.data);

    this.portsIn = Node.prepareProp('portsIn', attr.portsIn);
    this.portsOut = Node.prepareProp('portsOut', attr.portsOut);
  }

  static prepareProp(name, value) {
    switch (name) {
      case 'id':
        return value || ulid();
      case 'coordinates':
        return new Coordinates(value || {});
      case 'size':
        return new Size(value || {});
      case 'portsIn':
      case 'portsOut':
        return Object.entries(value || {}).reduce((acc, [key, val]) => {
          acc[key] = {
            type: val.type || 'text',
            value: val.value || ''
          };
          return acc;
        }, {});
      case 'data':
        return value || {};
      case 'category':
        return value || "default";
      case 'color':
        return value || "#4249FF";
      case 'deletable':
        return value !== false;
      default:
        return value;
    }
  }

  get portsHeight() {
    return Math.max(Object.keys(this.portsIn).length, Object.keys(this.portsOut).length) * Node.PORT_HEIGHT;
  }

  get width() {
    return this.size.width;
  }

  get height() {
    return this.size.height;
  }

  get x() {
    return this.coordinates.x;
  }

  get y() {
    return this.coordinates.y;
  }

  get x1() {
    return this.coordinates.x + this.size.width;
  }

  get y1() {
    return this.coordinates.y + this.size.height;
  }

  getPortCoordinates(type, name) {
    if (!['in', 'out'].includes(type)) throw new Error('Undefined port type ' + type);
    const ports = Object.keys(type === 'in' ? this.portsIn : this.portsOut);
    const index = ports.findIndex(portName => portName === name);
    if (index === -1) {
      throw new Error(`"${type}" port with name "${name}" is undefined!`);
    }

    return {
      x: this.x + (type === 'out' ? this.width : 1),
      y: this.y + this.height - (this.portsHeight - 2) + (index * Node.PORT_HEIGHT) + 1
    };
  }

  /**
   * @param {Node} a
   * @param {Node} b
   * @return {Boolean}
   */
  static intersect(a, b) {
    return !(a.x > b.x1 || b.x > a.x1 || a.y > b.y1 || b.y > a.y1);
  }
}