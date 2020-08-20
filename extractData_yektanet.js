window.onload = extractData;

function extractData() {
    var productDetails = {
        sku: null,
        title: null,
        image: null,
        price: null,
        discount: null,
        isAvailable: true,
        expiration: null,
        category: null,
        brand: null,
        averageVote: null,
        totalVotes: null,
    };

    var productDetailObj2 = getByldJson();
    for (var attrName in productDetailObj2) {
        productDetails[attrName] = productDetailObj2[attrName];
    }

    if (productDetails.sku === null) productDetails.sku = get_sku();
    if (productDetails.title === null) productDetails.title = get_title();
    if (productDetails.image === null) productDetails.image = get_image();
    if (productDetails.price === null) productDetails.price = get_price();
    if (productDetails.discount === null) productDetails.discount = get_discount();
    if (productDetails.isAvailable === null) productDetails.isAvailable = get_isAvailable();
    if (productDetails.expiration === null) productDetails.expiration = get_expiration();
    if (productDetails.category === null) productDetails.category = get_category();
    if (productDetails.brand === null) productDetails.brand = get_brand();
    if (productDetails.averageVote === null) productDetails.averageVote = get_averageVote();
    if (productDetails.totalVotes === null) productDetails.totalVotes = get_totalVotes();

    console.log(productDetails);
}

function dontSendError(callback) {
    try {
        callback();
    } catch (err) {
        return;
    }
}

// WE CAN GET IMAGE URL & TITLE BY LD+JSON /////////////////////////////////
function getByldJson() {
    var productInJson = JSON.parse(document.querySelector('script[type="application/ld+json"].yoast-schema-graph').innerHTML);
    var res = {};

    dontSendError(function () {
        res.image = productInJson['@graph'][2].url;
    });

    dontSendError(function () {
        res.title = productInJson['@graph'][4].itemListElement[2].item.name;
    });

    return res;
}

function get_sku() {
    var sku;

    dontSendError(function () {
        sku = document.querySelector('input[name="product_id"]').value;
    });

    if (sku !== undefined) {
        return sku;
    }
}

function get_title() {
    var title;

    dontSendError(function () {
        title = document.querySelector('.product_title h1').childNodes[0].textContent;
    });

    if (title !== undefined) {
        return title;
    }
}

function get_image() {
    var image;

    // FIRST METHOD TO GET:
    if (document.querySelector('meta[property="og:image"]')) {
        var metaContent = document.querySelector('meta[property="og:image"]').content;
        if (metaContent !== '') image = metaContent;
    }

    // SECOND METHOD TO GET:
    if (image === undefined) {
        dontSendError(function () {
            image = document.querySelector('img#attachment-shop_single').src;
        });
    }

    if (image !== undefined) {
        return image;
    }
}

function get_price() {
    var price;

    // FIRST METHOD TO GET:
    if (document.querySelector('meta[name="price"]')) {
        var priceContent = document.querySelector('meta[name="price"]').content;
        if (priceContent !== '') {
            price = priceContent;
        }
    }

    // SECOND METHOD TO GET
    if (price === undefined) {
        if (document.querySelector('p.price')) {
            var priceBox = document.querySelector('p.price');
            if (priceBox.children.length === 1) {
                price = parseFloat(priceBox.querySelector('span.amount').childNodes[0].textContent.replace(/\D/g, ''));
            } else if (priceBox.children.length > 1) {
                price = parseFloat(priceBox.querySelector('ins span.amount').childNodes[0].textContent.replace(/\D/g, ''));
            }
        }
    }

    if (price !== undefined) {
        return price;
    }
}

function get_discount() {
    var discount;

    dontSendError(function () {
        discount = parseInt(document.querySelector('p.price .nk_discount_label').children[1].textContent);
    });

    if (discount !== undefined) {
        return discount;
    }
}

// I SEARCHED IN THIS SITE BUT COULD'NT FIND ANY PRODUCT WHICH IS UNAVAILABLE
function get_isAvailable() {
    var availability;

    if (document.querySelector('meta[name="availability"]')) {
        var metaContent = document.querySelector('meta[name="availability"]').content;
        if (metaContent !== '') {
            if (metaContent == true) {
                availability = true;
            } else if (metaContent == false) {
                availability = false;
            }
        }
    }

    if (availability !== undefined) {
        return availability;
    }
}

function get_expiration() {
    var expirationTimeStamp;

    if (document.querySelector('.timer_nums')) {
        var allDateLeft = document.querySelectorAll('.timer_nums .num');

        var d = new Date();
        var timeStamp = d.getTime();

        allDateLeft.forEach(function (num, index, arr) {
            var numInt = parseFloat(num.textContent);
            if (index === 0) {
                timeStamp += numInt * 1000;
            }
            if (index === 1) {
                timeStamp += numInt * 1000 * 60;
            }
            if (index === 2) {
                timeStamp += numInt * 1000 * 60 * 60;
            }
            if (index === 3) {
                timeStamp += numInt * 1000 * 60 * 60 * 24;
            }
        });

        expirationTimeStamp = timeStamp;
    }

    if (expirationTimeStamp !== undefined) {
        return expirationTimeStamp;
    }
}

function get_category() {
    var catagory;

    if (document.querySelector('.product_meta .posted_in')) {
        var initCatagory = [];
        initCatagory.push(document.querySelector('.product_meta .posted_in a').textContent);
        catagory = initCatagory;
    }

    if (catagory !== undefined) {
        return catagory;
    }
}

function get_brand() {
    var brand;

    dontSendError(function () {
        brand = document.querySelector('.product_meta .brand_title a').textContent;
    });

    if (brand !== undefined) {
        return brand;
    }
}

function get_averageVote() {
    var averageVote;

    dontSendError(function () {
        averageVote = parseFloat(document.querySelector('.woocommerce-product-rating .star-rating span strong.rating').textContent);
    });

    if (averageVote !== undefined) {
        return averageVote;
    }
}

function get_totalVotes() {
    var totalVotes;

    dontSendError(function () {
        totalVotes = parseFloat(document.querySelector('.woocommerce-product-rating .star-rating span.rating').textContent);
    });

    if (totalVotes !== undefined) {
        return totalVotes;
    }
}
