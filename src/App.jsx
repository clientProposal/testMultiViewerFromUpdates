import { useRef, useEffect, act } from 'react'
import WebViewer from '@pdftron/webviewer';

function App() {
  const viewer = useRef(null);

  const inst = useRef(null);

  const hasBeenInitialized = useRef(false);

  const { VITE_PDFTRONKEY: licenseKey } = import.meta.env;

  const fullAPI = true;

  const path = 'webviewer/';

  const enableMeasurement = true;

  let countSeries = 0;

  useEffect(() => {
    if (!hasBeenInitialized.current) {
      hasBeenInitialized.current = true;

      WebViewer.default(
        {
          path,
          licenseKey,
          fullAPI,
          enableMeasurement
        },
        viewer.current
      ).then(async (instance) => {
        inst.current = instance;
        const { UI, Core, Feature } = instance;
        const { annotationManager } = Core;

        const prompts = [
          `Notice that the bookmarks correspond to the viewer that you currently have selected`,
          ``,
          `Try making measurement annotations in either viewer and notice how well they work`,
          ``,
          `Add two text fields from "Forms" tab in toolbar`,
          ``,
          `Fill two text fields from "Fill and sign" tab in toolbar`,
          ``,
          `Try using this in the console, running changeToOtherViewer() as many times as you wish and observing viewer selection:
              const getCurrentViewer = () => WebViewer.getInstance().UI.getActiveDocumentViewerKey();

              const changeToOtherViewer = () => {
                const curr = getCurrentViewer(WebViewer.getInstance().UI);
                WebViewer.getInstance().UI.setActiveDocumentViewerKey(curr === 1 ? 2 : 1);
              }

            changeToOtherViewer();
          `
        ]

        UI.addEventListener('activeDocumentViewerChanged', key => {
          console.log(countSeries);
          if (prompts[countSeries]) alert(prompts[countSeries]);
          countSeries++;
          console.log(prompts[countSeries])
        });

        UI.openElements(["tabPanel"]);
        UI.enableFeatures([UI.Feature.MultiViewerMode]);
        UI.enterMultiViewerMode();

        const viewers = Core.getDocumentViewers();
        viewers[0].loadDocument('/pdfs/test.pdf');
        viewers[1].loadDocument('/pdfs/test_2.pdf');
        viewers[0].setToolMode("panToolButton");
        viewers[1].setToolMode("panToolButton");

      });
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }} className="webviewer" ref={viewer}></div>
  );
}

export default App

