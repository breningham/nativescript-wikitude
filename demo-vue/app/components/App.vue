<template>
    <Page>
        <ActionBar title="Welcome to NativeScript-Vue-Wikitude!"/>
        <GridLayout columns="*" rows="*">
            <Wikitude v-bind:url="wikitude.world" v-on:WorldLoadSuccess="wikitude.onWorldLoadSuccess" col="0" row="0"></Wikitude>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
  export default {
    data() {
      return {
        wikitude: {
            world: "~/wikitude/sample/index.html",
            onWorldLoadSuccess: (e) => {
                console.log('World Laod Success', e);

                const permissions = require('nativescript-permissions');
                const wikitudeInstance = e.object;

                if ( permissions.hasPermission(android.Manifest.permission.CAMERA) ) {
                    console.log('We already have permissions');
                    return;
                } else {
                    permissions.requestPermission([
                        android.Manifest.permission.CAMERA,
                        android.Manifest.permission.ACCESS_FINE_LOCATION,
                        android.Manifest.permission.LOCATION_HARDWARE
                    ], "I need these permissions because I'm cool")
                        .then(() => {
                            console.log("Woo Hoo, I have the power!");
                            wikitudeInstance.restart();
                            alert('Please Kill and re-open the app if wikitude only shows black screen');
                        })
                        .catch((e) => {
                            console.log("Uh oh, no permissions - plan B time!", e);
                        });
                }
            }
        },
      }
    }
  }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }
</style>
