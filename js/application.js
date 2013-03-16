var NotesApp = (function () {
  var App = {
    stores: {}
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

  var Notes = Backbone.Collection.extend({

  });

  window.Note = Note;

  return App;
})();