// 导航栏切换时显示高亮
let links = document.querySelectorAll(".links a");
let bodyId = document.querySelector("body").id;

for (let link of links) {
    if (link.dataset.active == bodyId) {
        link.classList.add("active");
    }
}


// Wall页面图片点击放大效果
document.querySelectorAll('.wall-image-container img').forEach(image => {
    image.onclick = () => {
        document.querySelector('.popup-image').style.display = 'block';
        document.querySelector('.popup-image img').src = image.getAttribute('src');

    }
});

document.querySelector('.popup-image span').onclick = () => {
    document.querySelector('.popup-image').style.display = 'none';
}