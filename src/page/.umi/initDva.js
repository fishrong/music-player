import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'search', ...(require('/Volumes/CODE/project/front/antd-cource/src/model/search.js').default) });
app.model({ namespace: 'top', ...(require('/Volumes/CODE/project/front/antd-cource/src/model/top.js').default) });
