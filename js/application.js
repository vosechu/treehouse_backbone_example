var NotesApp = (function () {
  var App = {
    stores: {},
    views: {}
  };

  // Initialize localStorage
  App.stores.notes = new Store('notes');

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

  var NoteList = Backbone.Collection.extend({
    model: Note,

    localStorage: App.stores.notes,

    initialize: function () {
      var collection = this;

      // When localStorage updates, fetch data from the store instead of an API
      this.localStorage.bind('update', function () {
        collection.fetch();
      });
    }
  });

  $(document).ready(function () {
    App.views.new_form = new NewFormView({
      el: $('#new')
    });
  });

  return App;
})();