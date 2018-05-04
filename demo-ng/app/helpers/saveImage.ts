import { isIOS } from "tns-core-modules/platform";
import * as app from 'tns-core-modules/application';
import * as fsModule from 'tns-core-modules/file-system';
import { ImageFormat } from 'tns-core-modules/ui/enums';

declare const NSObject, interop, UIImage, NSError, UIImageWriteToSavedPhotosAlbum, android, java;

function broadCast(imageFile) {
  var mediaScanIntent = new android.content.Intent(android.content.Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
  var contentUri = android.net.Uri.fromFile(imageFile);
  mediaScanIntent.setData(contentUri);
  app.android.foregroundActivity.sendBroadcast(mediaScanIntent);
  return true;
}

function resolveFormat(format: string) {
  return ImageFormat.png;
}

export const saveToAlbum = function(imageSource, format: string) {

  format = resolveFormat(format);

  if (isIOS) {
      var res = false;
      if (!imageSource) {
          return res;
      }
      var result = true;
      var CompletionTarget = NSObject.extend({
          "thisImage:hasBeenSavedInPhotoAlbumWithError:usingContextInfo:": function(
              image, error, context) {
              if (error) {
                  result = false;
              }
          }
      }, {
          exposedMethods: {
              "thisImage:hasBeenSavedInPhotoAlbumWithError:usingContextInfo:": {
                  returns: interop.types.void,
                  params: [UIImage, NSError, interop.Pointer]
              }
          }
      });
      var completionTarget = CompletionTarget.new();
      UIImageWriteToSavedPhotosAlbum(imageSource.ios, completionTarget,
          "thisImage:hasBeenSavedInPhotoAlbumWithError:usingContextInfo:",
          null);
      return result;
  } else {
      var folderPath = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_PICTURES).toString();
      var fileName = 'img_' + new Date().getTime() + '.' + format;
      var path = fsModule.path.join(folderPath, fileName);
      var exists = fsModule.File.exists(path);
      if (!exists) {
          var saved = imageSource.saveToFile(path, format);
          if (saved) broadCast(new java.io.File(path));
      }
      return result;
  }
};