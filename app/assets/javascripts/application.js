var NotesApp = (function () {
  var App = {
    views: {},
    collections: {}
  };

  var Note = Backbone.Model.extend({
    baseUrl: '/notes',

    initialize: function () {
      if (!this.get('title')) {
        this.set({ title: "Note @ " + Date() });
      }
      if (!this.get('body')) {
        this.set({ body: "No content" });
      }
    }
  });

  var NoteList = Backbone.Collection.extend({
    url: '/notes',

    model: Note
  });

  App.collections.all_notes = new NoteList();

  var NewFormView = Backbone.View.extend({
    events: {
      "submit form": "createNote"
    },

    createNote: function (e) {
      var attrs = this.getAttributes,
          note = App.collections.all_notes.create(attrs);

      note.save();

      // Prevent the form from submitting
      e.preventDefault();
      // Prevent jQuery Mobile from seeing the submit event
      e.stopPropagation();

      $('.ui-dialog').dialog('close');
      this.reset();
    },

    getAttributes: function () {
      return {
        title: this.$('form [name="note[title]"]').val(),
        body: this.$('form [name="note[body]"]').val()
      };
    },

    reset: function () {
      this.$('input, textarea').val('');
    }
  });

  var NoteListView = Backbone.View.extend({
    initialize: function (options) {
      this.el = options.el;
      this.collection = options.collection;

      // Ensure `this` is always the view in these functions
      _.bindAll(this, 'addOne', 'addAll');

      this.collection.bind('add', this.addOne);
      this.collection.bind('refresh', this.addAll);

      this.collection.fetch();
    },

    addOne: function (note) {
      var view = new NoteListItemView({model: note});
      $(this.el).append(view.render().el);
      $(this.el).listview('refresh');
    },

    addAll: function () {
      $(this.el).empty();
      this.collection.each(this.addOne);
      $(this.el).listview('refresh');
    }
  });

  var NoteListItemView = Backbone.View.extend({
    tagName: 'li',

    template: _.template($('#note-list-item-template').html()),

    initialize: function () {
      _.bindAll(this, 'render');

      this.model.bind('change', this.render);
    },

    render: function () {
      $(this.el).html(this.template({note: this.model}));
      return this;
    }
  });

  App.views.new_form = new NewFormView({
    el: $('#new')
  });

  App.views.list_view = new NoteListView({
    el: $('#all_notes'),
    collection: new NoteList()
  });

  return App;
})();