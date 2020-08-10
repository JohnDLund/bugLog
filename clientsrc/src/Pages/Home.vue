<template>
  <div class="bugs container-fluid">
    <div class="m-3 row justify-content-center">
      <h1 class="text-light">Bug Log</h1>
    </div>

    <div class="row my-4 justify-content-center">
      <button
        class="btn btn-block btn-primary mb-2 col-md-7 col-12"
        @click="listBug = !listBug"
        v-if="listBug == false"
      >List Bug</button>
      <div class="col-12 d-flex justify-content-center" v-if="listBug == true">
        <form
          class="form-inline col-md-7 col-12 d-flex justify-content-center"
          @submit.prevent="addBug"
        >
          <input
            class="mb-2 col-4 mr-2 form-control text-center"
            type="text"
            placeholder="Enter a bug title"
            v-model="newBugObject.title"
            required
          />
          <input
            class="mb-2 col-7 form-control text-center"
            type="text"
            placeholder="Enter a bug description"
            v-model="newBugObject.description"
          />
          <button class="btn btn-block btn-primary mb-2" type="submit">Submit</button>
        </form>
      </div>
    </div>

    <div class="row text-light my-2 border-bottom">
      <h3 class="col-md-3 col-12">Title:</h3>
      <h3 class="col-md-3 col-12">Reported By:</h3>
      <h3 class="col-md-3 col-12">
        Status:
        <i class="fa fa-sort" @click="sortBugs"></i>
      </h3>
      <h3 class="col-md-3 col-12">Last Modified:</h3>
    </div>

    <div class="row py-2" v-for="bug in bugs" :bugData="bug" :key="bug.id">
      <h4 class="col-md-3 col-12 text-capitalize">
        <div class="row">
          <router-link class="col-6" :to="{name: 'BugDetails', params: {id: bug.id}}">
            <b>{{bug.title}}</b>
          </router-link>
          <div class="col-6">
            <i
              class="fa fa-pencil text-warning px-3"
              v-if="bug.closed == false"
              data-toggle="modal"
              :data-target="'#editBugModal'
          +
          bug.id"
            ></i>
            <i
              class="fa fa-trash-o text-danger"
              v-if="bug.closed == false"
              @click="deleteBug(bug.id)"
            ></i>
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
            <div class="modal-content p-4">
              <form class="form" @submit.prevent="editBug(bug.id)">
                <input
                  type="text"
                  class="form-control mb-2"
                  placeholder="Edit bug title ..."
                  v-model="editedBugObject.title"
                />
                <textarea
                  type="text"
                  class="form-control mb-2"
                  placeholder="Edit bug description ..."
                  rows="3"
                  v-model="editedBugObject.description"
                />
                <button type="button" class="btn btn-secondary mr-2" data-dismiss="modal">Close</button>
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
      listBug: false,
      sortedBugs: false,
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
    sortBugs() {
      this.sortedBugs = !this.sortedBugs;
      if (this.sortedBugs == true) {
        this.bugs.sort((x, y) => x.closed - y.closed);
      } else this.bugs.sort((x, y) => y.closed - x.closed);
    },

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
