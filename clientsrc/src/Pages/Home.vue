<template>
  <div class="bugs container-fluid">
    <div class="m-3 row justify-content-center">
      <h1 class="text-light">Bug Log</h1>
    </div>

    <div class="row my-4 justify-content-center">
      <form class="col-md-3 col-12" @submit.prevent="addBug">
        <input
          class="mb-2 form-control text-center"
          type="text"
          placeholder="Enter a bug title"
          v-model="newBugObject.title"
          required
        />
        <input
          class="mb-2 form-control text-center"
          type="text"
          placeholder="Enter a bug description"
          v-model="newBugObject.description"
        />
        <button class="btn btn-block btn-primary mb-2" type="submit">List a Bug</button>
      </form>
    </div>

    <div class="row text-light my-2 border-bottom">
      <h3 class="col-md-3 col-12">Title:</h3>
      <h3 class="col-md-3 col-12">Reported By:</h3>
      <h3 class="col-md-3 col-12">Status:</h3>
      <h3 class="col-md-3 col-12">Last Modified:</h3>
    </div>

    <div class="row py-2" v-for="bug in bugs" :bugData="bug" :key="bug.id">
      <h4 class="col-md-3 col-12 text-capitalize">
        <div class="row">
          <router-link class="col-5" :to="{name: 'bug', params: {bug: bug.id}}">
            <b>{{bug.title}}</b>
          </router-link>
          <div class="col-6">
            <i
              class="fa fa-pencil text-warning px-3"
              data-toggle="modal"
              :data-target="'#editBugModal'
          +
          bug.id"
            ></i>
            <i class="fa fa-trash-o text-danger" @click="deleteBug(bug.id)"></i>
          </div>
        </div>
        <div
          class="modal fade"
          :id="'editBugModal'
          +
          bug.id"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <form class="form" @submit.prevent="editBug(bug.id)">
                <input
                  type="text"
                  class="form-control mb-2 text-capitalize"
                  placeholder="Edit bug title ..."
                  v-model="editedBugObject.title"
                />
                <input
                  type="text"
                  class="form-control mb-2 text-capitalize"
                  placeholder="Edit bug description ..."
                  v-model="editedBugObject.description"
                />
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary">Save changes</button>
              </form>
            </div>
          </div>
        </div>
      </h4>
      <h4 class="col-md-3 col-12 text-info">{{bug.creator.name}}</h4>
      <h4 class="col-md-3 col-12 text-success" v-if="bug.closed == false">Open</h4>
      <h4 class="col-md-3 col-12 text-danger" v-else>Closed</h4>
      <h4 class="col-md-3 col-12 text-warning">{{timeConversion(bug.updatedAt)}}</h4>
    </div>
  </div>
</template>

<script>
export default {
  name: "bugs",
  data() {
    return {
      newBugObject: {},
      editedBugObject: {},
    };
  },

  mounted() {
    this.$store.dispatch("getBugs");
  },

  computed: {
    bugs() {
      return this.$store.state.bugs;
    },
    user() {
      return this.$store.state.profile;
    },
  },

  methods: {
    timeConversion(data) {
      let newTime = data.slice(0, 10);
      return newTime;
    },
    addBug() {
      this.$store.dispatch("addBug", this.newBugObject);
      this.newBugObject = { title: "", description: "" };
    },
    deleteBug(id) {
      this.$store.dispatch("deleteBug", id);
    },

    editBug(id) {
      this.$store.dispatch("editBug", {
        id: id,
        title: this.editedBugObject.title,
        description: this.editedBugObject.description,
        creatorEmail: this.user.email,
      });
      this.editClicked = false;
      this.editedBugObject = { title: "", description: "" };
      $("#editBugModal" + id).modal("hide");
    },
  },
};
</script>
