import { useRef, useEffect } from 'react'
import WebViewer from '@pdftron/webviewer';

function App() {
  const viewer = useRef(null);

  const inst = useRef(null);

  const hasBeenInitialized = useRef(false);

  const { VITE_PDFTRONKEY: licenseKey } = import.meta.env;

  const fullAPI = true;

  const path = 'webviewer/';

  const createLineAnnotation = (Annotations, PageNumber = 1, X = 400, Y = 400, Width = 3, Height = 50) => {
    
    return new Annotations.LineAnnotation({

      PageNumber,

      X,

      Y,

      Width,

      Height

    })

  }

  const includeAnnotation = (annotation, annotationManager) => {

    annotationManager.addAnnotation(annotation);

    annotationManager.redrawAnnotation(annotation);

    annotationManager.selectAnnotation(annotation);

  }


  useEffect(() => {
    if (!hasBeenInitialized.current) {
      hasBeenInitialized.current = true;

      WebViewer.default(
        {
          path,
          licenseKey,
          fullAPI
        },
        viewer.current
      ).then(async (instance) => {
        inst.current = instance;
        const { UI, Core } = instance;
        let runBookmarksOnce = false;
        let runMeasurementAnnotationsOnce = false;
        const { Annotations, annotationManager } = instance.Core;

        // annotationManager.addEventListener('annotationChanged', (annotations, action, {
        //   imported, fromHistory } = {}) => {
        //   alert(`You have changed the annotations, with the action: ${action}. Your annotations are of type: ${annotations.map(a => `${a.getType()}, `)}`)
        //   if (!runMeasurementAnnotationsOnce) {
        //     runMeasurementAnnotationsOnce = true;
        //   }
        // });

        // UI.addEventListener('activeDocumentViewerChanged', key => {
        //   console.log(`runBookmarksOnce is ${runBookmarksOnce}`)
        //   if (!runBookmarksOnce) {
        //     const { activeDocumentViewerKey, previousDocumentViewerKey } = key.detail;
        //     alert(`Bookmarks now from viewer ${previousDocumentViewerKey}, changing to viewer ${activeDocumentViewerKey}`);
        //     // if (activeDocumentViewerKey === 1) {
        //     //   runBookmarksOnce = true;
        //     //   setTimeout(() => { instance.UI.setActiveDocumentViewerKey(2); }, "3000");
        //     // } else {
        //     //   setTimeout(() => { instance.UI.setActiveDocumentViewerKey(1); }, "3000");
        //     // }
        //   }

        // });

        UI.openElements(["tabPanel"]);
        UI.enableFeatures([UI.Feature.MultiViewerMode]);
        UI.enterMultiViewerMode();

        const viewers = Core.getDocumentViewers();
        viewers[0].loadDocument('/pdfs/test.pdf');
        viewers[1].loadDocument('/pdfs/test_2.pdf');
        // setTimeout(() => { instance.UI.setActiveDocumentViewerKey(2); }, "3000");


      });
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }} className="webviewer" ref={viewer}></div>
  );
}

export default App

