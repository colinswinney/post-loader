const postLoaders = document.querySelectorAll(".wp-block-cjsb-post-loader");

postLoaders.forEach((loader) => {
	postLoader(loader);
});

// // (A) URL SEARCH PARAMS OBJECT TO QUICKLY BUILD QUERY STRING
// var query = new URLSearchParams({
// 	name : "John Doe",
// 	email : "john@doe.com",
// 	colors : JSON.stringify(["Red", "Green", "Blue"])
//   });
//   query.append("KEY", "VALUE"); // To append more data

//   // (B) CONVERT TO STRING, APPEND TO URL
//   var url = "http://site.com/page?" + query.toString();
//   console.log(url);

//   // (C) WHATEVER COMES NEXT...
//   // REDIRECT OR AJAX CALL OR FETCH
//   window.location.href = 'url';

function postLoader(el) {

    const data = el.dataset;
    const urlBase = "/wp-json/wp/v2/";
	let pageNumber = data.pageNumber;
    let markupCreated = false;

    // main function that will run once on load and then every time the view more button is clicked
    function getPosts(pageNumber) {
		fetch(
			urlBase +
            data.postType +
            "?per_page=" + data.perPage +
            "&orderby=" + data.orderby +
            "&order=" + data.order +
            "&page=" + pageNumber +
            "&_embed"
        )
        .then((response) =>
            response.json().then((json) => ({
                totalPages: response.headers.get("x-wp-totalpages"),
                totalPosts: response.headers.get("x-wp-total"),
                json,
            })),
        )
        .then((response) => {

            // create markup just once
            markupCreated === false ? createMarkup() : '';
            markupCreated = true;

            const container = el.querySelector(".wp-block-cjsb-post-loader__container");
            // const viewMoreBtn = el.querySelector(".wp-block-cjsb-post-loader__view-more-btn");

            // loader.classList.remove("show");

            console.log(Number(response["totalPosts"]),  Number(data.perPage))

            // Number(response["totalPosts"]) < Number(data.perPage)
            // 	? viewMoreBtn.remove()
            // 	: viewMoreBtn.classList.add("show");

            container.dataset.total
            	? ""
            	: container.setAttribute("data-total", response["totalPages"]);

            displayPosts(response);
        })
        .catch((err) => {
            console.log(err);
        });
	}

	getPosts(pageNumber);

    // TODO - add button and loader animation
    function createMarkup() {

        // container - ul
        const container = document.createElement("ul");
        container.classList.add("wp-block-cjsb-post-loader__container");
        container.setAttribute("role", "list");
        container.setAttribute("data-current", "1");
        el.appendChild(container);

        // view more - button
        const viewMoreBtn = document.createElement("button");
        viewMoreBtn.classList.add("wp-block-cjsb-post-loader__view-more-btn");
        viewMoreBtn.setAttribute("data-current", "1");
        viewMoreBtn.innerText = "View More";
        el.appendChild(viewMoreBtn);

        // give view more button its magic
        viewMoreBtn.addEventListener("click", function () {
            const containerCurrentPage = Number(container.dataset.current);
            const totalPages = Number(container.dataset.total);
            // loader.classList.add("show");
			window.location.href = element.href + '?query=value';
            viewMoreBtn.classList.remove("show");

            if (containerCurrentPage < totalPages) {
                data.pageNumber = containerCurrentPage + 1;
                container.setAttribute("data-current", containerCurrentPage + 1);
                getPosts(data.pageNumber);
                console.log(data.pageNumber);
                data.pageNumber == totalPages ? viewMoreBtn.remove() : "";
            }
        });
    }

    function displayPosts(response) {
		const posts = response["json"];
		posts.map((post) => createCard(post));
	}

    function createCard(post) {
        const container = el.querySelector(".wp-block-cjsb-post-loader__container");
        const listItem = document.createElement("li");
        const card = document.createElement("article");

        card.classList.add("wp-block-cjsb-post-loader__card");

		data.showThumbnail === 'true' ? createCardImageWrap(post, card) : '';

        data.showTitle === 'true' ||
        data.showDate === 'true' ||
        data.showExcerpt === 'true' ||
        data.showContent === 'true' ||
        data.showAuthor === 'true' ||
        data.showCategories === 'true' ||
        data.showTags === 'true' ? createCardContentWrap(post, card) : '';

        listItem.appendChild(card);
        container.appendChild(listItem);
    }

    function createCardImageWrap(post, card) {
        if (post._embedded['wp:featuredmedia']) {
            const cardImgWrap = document.createElement("div");
            cardImgWrap.setAttribute("class", "wp-block-cjsb-post-loader__card__image-wrap");

            const cardImage =
                "<a href='" + post.link + "'>" +
                    "<img " +
                        "src='" + post._embedded['wp:featuredmedia'][0]['media_details']['sizes'][data.showThumbnailSize]['source_url'] + "'" +
                        "alt='" + post._embedded['wp:featuredmedia'][0]['alt_text'] + "'" +
                        "height='" + post._embedded['wp:featuredmedia'][0]['media_details']['sizes'][data.showThumbnailSize]['height'] + "'" +
                        "width='" + post._embedded['wp:featuredmedia'][0]['media_details']['sizes'][data.showThumbnailSize]['width'] + "'" +
                    "/>" +
                "</a>";
            cardImgWrap.insertAdjacentHTML("beforeend", cardImage);

            card.appendChild(cardImgWrap);
        }
    }

    function createCardContentWrap(post, card) {

        const cardContentWrap = document.createElement("div");
        cardContentWrap.classList.add("wp-block-cjsb-post-loader__card__content-wrap");

        if (data.showTitle === 'true') {
            const cardTitle = '<h2 class="wp-block-cjsb-post-loader__card__title"><a href="'+  post.link +'">'+  post.title.rendered +'</a></h2>';
            cardContentWrap.insertAdjacentHTML("beforeend", cardTitle);
        }

        if (data.showContent === 'true') {
            const cardContent = '<div class="wp-block-cjsb-post-loader__card__content">'+  post.content.rendered +'</div>';
            cardContentWrap.insertAdjacentHTML("beforeend", cardContent);
        }

        if (data.showExcerpt === 'true') {
            const cardExcerpt = '<div class="wp-block-cjsb-post-loader__card__excerpt">'+  post.excerpt.rendered +'</div>';
            cardContentWrap.insertAdjacentHTML("beforeend", cardExcerpt);
        }

        if (data.showDate === 'true') {
            getFormattedDate(post.date, data.showDateFormat)
            const cardDate = '<time datetime='+ post.date +' class="wp-block-cjsb-post-loader__card__date">'+  getFormattedDate(post.date, data.showDateFormat) +' </time>';
            cardContentWrap.insertAdjacentHTML("beforeend", cardDate);
        }

        if (data.showAuthor === 'true') {
            const cardExcerpt = '<span class="wp-block-cjsb-post-loader__card__author">'+  post._embedded.author[0].name +' </span>';
            cardContentWrap.insertAdjacentHTML("beforeend", cardExcerpt);
        }

        if (data.showCategories === 'true') {
            const cardCategories = '<span class="wp-block-cjsb-post-loader__card__categories">' +
                post._embedded['wp:term'][0].map( ( cat ) => [
                        ' <a href='+ cat.link +'>'+ cat.name +'</a>'
                    ]) + '</span>';
            cardContentWrap.insertAdjacentHTML("beforeend", cardCategories);
        }

        if (data.showTags === 'true') {
            const cardTags = '<span class="wp-block-cjsb-post-loader__card__tags">' +
                post._embedded['wp:term'][1].map( ( tag ) => [
                        ' <a href='+ tag.link +'>'+ tag.name +'</a>'
                    ]) + '</span>';
            cardContentWrap.insertAdjacentHTML("beforeend", cardTags);
        }

        card.appendChild(cardContentWrap);
    }

    // TODO - combine these two functions with edit.js
    const postDate = (postDate) => new Date(postDate);
    const getFormattedDate = (date, showDateFormat) => {
		const dateFormats = [
			// Thursday, July 07, 2022
			{ day: '2-digit', weekday: 'long', year: 'numeric', month: 'long' },
			// Thu, Jul 07, 2022
			{ day: '2-digit', weekday: 'short', year: 'numeric', month: 'short' },
			// Jul 07, 2022
			{ day: '2-digit', year: 'numeric', month: 'long' },
			// Jul 07, 2022
			{ day: '2-digit', year: 'numeric', month: 'short' },
			// 07/07/22
			{ day: '2-digit', year: '2-digit', month: '2-digit' },
			// 07/07/2022
			{ day: '2-digit', year: 'numeric', month: '2-digit' },
			// 07/07/22 -> 07.07.22
			{ day: '2-digit', year: '2-digit', month: '2-digit' },
			// 07/07/2022 -> 07.07.2022
			{ day: '2-digit', year: 'numeric', month: '2-digit' },
		];

		let formattedDate = postDate(date).toLocaleDateString('en-US', dateFormats[showDateFormat]);

		showDateFormat === '6' || showDateFormat === '7' ? formattedDate = formattedDate.replaceAll('/', '.') : null;

		return formattedDate;
	}
}