import { renderHeaderComponent } from "./header-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
    <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container">
  <div class="upload-image ">
      
            <label class="file-upload-label secondary-button">
                <input type="file" class="file-upload-input" style="display:none">
                Выберите фото
            </label>
          
      
  </div>
</div>
          <label>
            Опишите фотографию:
            <textarea class="input textarea" rows="4"></textarea>
            </label>
            <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
      </div>
  `;

    appEl.innerHTML = appHtml;
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
    let description  = document.querySelector('.textarea')
    const fileInputElement = document.querySelector('.file-upload-input');
    const data = ''
    
    function reuploadFile() {
      
      document.querySelector('.file-upload-remove-button').addEventListener('click', () => {
        let block = document.querySelector('.upload-image')
        block.innerHTML = `<label class="file-upload-label secondary-button">
        <input type="file" class="file-upload-input" style="display:none">
        Выберите фото
    </label>`
    
      let fileInputElement = document.querySelector('.file-upload-input');
        inputElem(fileInputElement, postImage)
      
      })
    }

    function inputElem(fileInputElement, postImage) {
      fileInputElement.addEventListener('input', (e) => {
        postImage({ file: fileInputElement.files[0] })
      })
    }

    inputElem(fileInputElement, postImage)


    function postImage({ file }) {
      const data = new FormData();
      data.append("file", file);

      return fetch('https://wedev-api.sky.pro/api/upload/image', {
        method: "POST",
          body: data,
        
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          
          let imageUrl = data.fileUrl
          addNewPost(imageUrl)
          renderImgSmall(imageUrl)
          return imageUrl
        });
    }
    function renderImgSmall(imageUrl) {
      let block = document.querySelector('.upload-image')
      block.innerHTML = `
    <img class="file-upload-image" src="${imageUrl}">
    <button class="file-upload-remove-button button">Заменить фото</button>
    `
    reuploadFile()
    }
    function addNewPost(imageUrl) {
      document.getElementById("add-button").addEventListener("click", () => {
        onAddPostClick({
          
          description: description.value,
           imageUrl: imageUrl,
        });
        
      });
    }
  };

  render();
}

