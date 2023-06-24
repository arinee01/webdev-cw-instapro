// Замени на свой, чтобы получить независимый от других набор данных.


import { reRenderLikes } from "./components/posts-page-component.js";
import { goToPage, renderApp } from "./index.js";

// "боевая" версия инстапро лежит в ключе prod
const personalKey = "arinee01";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export let allPosts = [];
export let post = [];

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json()
      } if (response.status === 500) {
        return Promise.reject(new Error("Сервер упал"))
      } else {
        return Promise.reject(new Error("неизвестная ошибка"))
      }
    })
    .then((responseData) => {
      allPosts = responseData.posts.map((post) => {
        return {
          postId: post.id,
          postUrl: post.imageUrl,
          postDate: post.createdAt,
          description: post.description,
          userId: post.user.id,
          userName: post.user.name,
          userUrl: post.user.imageUrl,
          likes: post.likes,
          isLiked: post.isLiked
        }
      })
      renderApp()
      
    }).catch((error) => {
      console.log(error)
      goToPage(LOADING_PAGE)
    })
    ;
}

export function postNew({token}, description, imageUrl) {
  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: JSON.stringify({
      'description': description.replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replace("|", "<div class='quote'>")
      .replace("|", "</div>"),
      'imageUrl': imageUrl,
    })
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("произошла ошибка");
    }
    return response.json()
  }).then((responseData) => {
    getPosts({token})
  })
}

// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

export function userImages({token}, userId) {
    return fetch(postsHost + '/user-posts/' + userId, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json()
      } if (response.status === 500) {
        return Promise.reject(new Error("Сервер упал"))
      } else {
        return Promise.reject(new Error("неизвестная ошибка"))
      }
    })
    .then((responseData) => {
      allPosts = responseData.posts.map((post) => {
        return {
          postId: post.id,
          postUrl: post.imageUrl,
          postDate: post.createdAt,
          description: post.description,
          userId: post.user.id,
          userName: post.user.name,
          userUrl: post.user.imageUrl,
          likes: post.likes,
          isLiked: post.isLiked
        }
      })
      renderApp()
      
    }).catch((error) => {
      console.log(error)
      goToPage(LOADING_PAGE)
    })
    ;
}

export function likePost(id, {token}) {
  return fetch(postsHost + '/' + id + '/like', {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json()
      } if (response.status === 500) {
        return Promise.reject(new Error("Сервер упал"))
      } if (response.status === 401) {
        alert("Только авторизованные пользователи могут ставить лайки");
        return Promise.reject(new Error("авторизация не пройдена"))
      }
       else {
        return Promise.reject(new Error("неизвестная ошибка"))
      }
    })
    .then((responseData) => {
      post = new Map(Object.entries(responseData.post))      
      reRenderLikes(post)
      
    }).catch((error) => {
      console.log(error)
    })
    ;
  
}

export function delikePost(id, {token}) {
  return fetch(postsHost + '/' + id + '/dislike', {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json()
      } if (response.status === 500) {
        return Promise.reject(new Error("Сервер упал"))
      } else {
        return Promise.reject(new Error("неизвестная ошибка"))
      }
    })
    .then((responseData) => {
      post = new Map(Object.entries(responseData.post))
      reRenderLikes(post)
      
    }).catch((error) => {
      console.log(error)
    })
    ;
}