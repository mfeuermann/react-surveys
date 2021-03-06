var React = require('react');
var uuid = require('uuid');
var inArray = require('in-array');
var clone = require('lodash/clone');
var without = require('lodash/without');
var OptionEditor = require('../OptionEditor');
var reject = require('lodash/reject');
var assign = require('lodash/assign');

var CheckboxType = React.createClass({
  getDefaultProps: function() {
    return {
      editing: false,
      answerCallback: null,
      editCallback: null
    };
  },

  getInitialState: function() {
    return {
      id: null,
      name: null,
      required: false,
      description: null,
      answers: [],
      options: []
    }
  },

  componentDidMount: function() {
    this.setState({
      id: this.props.id,
      name: this.props.name,
      required: this.props.required,
      description: this.props.description,
      options: this.props.options
    });
  },

  editUpdate: function(updates) {
    if (this.props.editCallback) {
      this.props.editCallback(assign({
        id: this.state.id,
        name: this.state.name,
        required: this.state.required,
        description: this.state.description,
        options: this.state.options
      }, updates));
    }
  },

  editAnswer: function(answer) {
    if (this.props.answerCallback) {
      this.props.answerCallback({
        id: this.state.id,
        answer: answer
      });
    }
  },

  nameChanged: function(ev) {
    this.setState({
      name: ev.target.value
    });
    this.editUpdate({name: ev.target.value});
  },

  descriptionChanged: function(ev) {
    this.setState({
      description: ev.target.value
    })
    this.editUpdate({description: ev.target.value});
  },

  isChecked: function(option_id) {
    return inArray(this.state.answers, option_id);
  },

  selected: function(option_id) {
    if (!inArray(this.state.answers, option_id)) {
      var answers = clone(this.state.answers);
      answers.push(option_id);
      this.setState({answers: answers});
      this.editAnswer(answers);
    }
    else {
      var answers = without(this.state.answers, option_id);
      this.setState({answers: answers});
      this.editAnswer(answers);
    }
  },

  addOption: function(option_name) {
    var options = clone(this.state.options);
    options.push({
      id: uuid.v4(),
      name: option_name
    });
    this.setState({options: options});
    this.editUpdate({options: options});
  },

  removeOption: function(option_id) {
    var options = reject(this.state.options, function(option) {
      return option.id === option_id;
    });
    this.setState({options: options});
    this.editUpdate({options: options});
  },

  render: function() {
    if (!this.props.editing) {
      var options = this.state.options.map(function(option) {
        return (
          <label className="checkbox-inline">
            <input type="checkbox" onClick={this.selected.bind(this, option.id)} checked={this.isChecked(option.id)}/>{option.name}
          </label>
        )
      }.bind(this));

      return (
        <div>
          <h3>{this.state.name}</h3>
          <h4>{this.state.description}</h4>
          {options}
        </div>
      );
    }
    else {
      return (
        <div>
          <form>
            <div className="form-group">
              <label>Question name</label>
              <input type="text" className="form-control" placeholder="Question name" onChange={this.nameChanged} value={this.state.name}/>
            </div>
            <div className="form-group">
              <label>Question description</label>
              <input type="text" className="form-control" placeholder="Question description" onChange={this.descriptionChanged} value={this.state.description}/>
            </div>
          </form>

          <OptionEditor options={this.state.options} addCallback={this.addOption} removeCallback={this.removeOption} />
        </div>
      );
    }
  }
});

module.exports = CheckboxType;
