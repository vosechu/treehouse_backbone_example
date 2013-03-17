var NotesApp = (function () {
  var App = {
    stores: {},
    views: {},
    collections: {}
  };

  // Initialize localStorage
  App.stores.notes = new Backbone.LocalStorage("notes");

  var Note = Backbone.Model.extend({
    localStorage: App.stores.notes,

    initialize: function () {
      if (!this.get('title')) {
        this.set({ title: "Note @ " + Date() });
      }
      if (!this.get('body')) {
        this.set({ body: "No content" });
      }
    }
  });

  var NewFormView = Backbone.View.extend({
    events: {
      "submit form": "createNote"
    },

    createNote: function (e) {
      var attrs = this.getAttributes,
          note = new Note();

      note.set(attrs);
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
        title: this.$('form [name=title]').val(),
        body: this.$('form [name=body]').val()
      };
    },

    reset: function () {
      this.$('input, textarea').val('');
    }
  });

  var NoteListView = Backbone.View.extend({
    initialize: function () {
      // Ensure `this` is always the view in these functions
      _.bindAll(this, 'addOne', 'addAll');

      this.collection.bind('add', this.addOne);
      this.collection.bind('reset', this.addAll);

      this.collection.fetch();
    },

    addOne: function (note) {
      var view = new NoteListItemView({model: note});
      $(this.el).append(view.render().el);
    },

    addAll: function () {
      $(this.el).empty();
      this.collection.each(this.addOne);
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

  var NoteList = Backbone.Collection.extend({
    model: Note,

    localStorage: App.stores.notes
  });

  App.collections.all_notes = new NoteList();

  App.views.new_form = new NewFormView({
    el: $('#new')
  });

  App.views.list_view = new NoteListView({
    el: $('#all_notes'),
    collection: App.collections.all_notes
  });

  window.Note = Note;

  return App;
})();