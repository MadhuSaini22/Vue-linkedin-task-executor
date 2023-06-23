<template>
  <div>
    <hello-world />
    <button id="customEventButton">Trigger Custom Event</button>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "App",
  components: { HelloWorld },
  mounted() {
    const customEventButton = document.getElementById("customEventButton");
    customEventButton.addEventListener("click", () => {
      // if (chrome.runtime.lastError) return;
      const eventData = {
        event: "jug-linkedin",
        data: {
          keywords: "example search",
        },
      };
      chrome.runtime.sendMessage(eventData);
    });

    // // Listen for the results event
    // chrome.runtime.onMessage.addListener((message) => {
    //   if (message.event === "jug-linkedin-result") {
    //     const results = message.data;
    //     console.log("Received results:", results);
    //     // ... do something with the results
    //   }
    // });
  },
};
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
