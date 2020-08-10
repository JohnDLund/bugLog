<template>
  <div class="BugDetails container-fluid text-light">
    <h1 class="row justify-content-center my-4 text-capitalize">{{bug.title}}</h1>
    <div class="row text-center justify-content-between">
      <div class="col-6">
        reported by:
        <span class="text-primary">{{bug.creatorEmail}}</span>
      </div>
      <div class="col-6">
        status:
        <span class="text-success" v-if="bug.closed == false">Open</span>
        <span class="text-danger" v-if="bug.closed == true">Closed</span>
      </div>
    </div>
    <div class="row justify-content-center my-4">
      <div class="col-9 border">{{bug.description}}</div>
    </div>
    <div class="row justify-content-center my-4">
      <div class="col-2">
        <button
          class="btn btn-warning"
          data-toggle="modal"
          :data-target="'#postNoteModal' + bug.id"
        >New Note</button>
      </div>

      <div class="col-6 d-flex justify-content-end">
        <button class="btn btn-danger mr-2" @click="closeBug(bug.id)">Close Bug</button>
        <button class="btn btn-success" @click="openBug(bug.id)">Open Bug</button>
      </div>
    </div>

    <div class="row text-light my-2 border-bottom justify-content-center">
      <h4 class="col-md-4 col-12">Name:</h4>
      <h4 class="col-md-6 col-12">Note:</h4>
      <h4 class="col-md-2 col-12">Delete:</h4>
    </div>

    <div class="row" v-for="note in notes" :noteData="note" :key="note.id">
      <h4 class="col-md-4 col-12">{{note.creatorEmail}}</h4>
      <h4 class="col-md-6 col-12">{{note.content}}</h4>
      <h4 class="col-md-2 col-12">
        <i class="fa fa-trash-o text-danger" @click="deleteNote(note)"></i>
      </h4>
    </div>

    <div
      class="modal fade"
      :id="'postNoteModal' + bug.id"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content p-4">
          <form class="form" @submit.prevent="postNote(bug.id)">
            <textarea
              type="text"
              class="form-control mb-2"
              placeholder="Add note to this bug ..."
              rows="3"
              v-model="newNoteObject.content"
            />
            <button type="button" class="btn btn-secondary mr-2" data-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary">Save Note</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "BugDetails",
  data() {
    return {
      newNoteObject: {},
    };
  },
  mounted() {
    this.$store.dispatch("getActiveBug", this.$route.params.id);
    this.$store.dispatch("getNotes", this.$route.params.id);
  },

  computed: {
    bug() {
      return this.$store.state.activeBug;
    },
    notes() {
      return this.$store.state.notes;
    },
    profile() {
      return this.$store.state.profile;
    },
  },
  methods: {
    closeBug(bugId) {
      this.$store.dispatch("editBug", { id: bugId, closed: true });
    },
    openBug(bugId) {
      this.$store.dispatch("editBug", { id: bugId, closed: false });
    },
    deleteNote(note) {
      this.$store.dispatch("deleteNote", note);
    },
    postNote(rawBugId) {
      this.$store.dispatch("postNote", {
        bugId: rawBugId,
        content: this.newNoteObject.content,
        creatorEmail: this.profile.email,
      });
      this.newNoteObject = { content: "" };
      $("#postNoteModal" + rawBugId).modal("hide");
    },
  },
  components: {},
};
</script>


<style scoped>
</style>