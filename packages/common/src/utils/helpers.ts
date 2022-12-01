export const setGlobalConfig = () => {};

export const copy = (content: string) => {
  const oInput = document.createElement('input');
  oInput.value = content;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象
  document.execCommand('Copy'); // 执行浏览器复制命令
  oInput.remove();
};
