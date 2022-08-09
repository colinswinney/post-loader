<?php

/**
 * Post Loader Rest API
 */
class Post_Loader_Rest_API {

    /**
     * __construct
     * 
     * @see https://developer.wordpress.org/reference/hooks/rest_api_init/
     * 
     * @param void
     * 
     * @return void
     */
    public function __construct() {
        add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
    }
    


    /**
     * register_rest_routes
     * 
     * @see https://developer.wordpress.org/reference/functions/register_rest_route/
     * 
     * @param void
     * 
     * @return void
     */
    public function register_rest_routes() {
        register_rest_route(
            'post-loader/v1',
            '/functions',
            array(
                'methods' => 'GET',
                'permission_callback' => '__return_true',
                'callback' => array( $this, 'register_route_callback' ),
            )
        );
    }
    


    /**
     * register_route_callback
     * 
     * @param void
     * 
     * @return array
     */
    public function register_route_callback() {
        return array(
            'image_sizes' => $this->image_sizes(),
            'categories' => $this->categories(),
        );
    }



    /**
     * image_sizes
     * 
     * @param void
     * 
     * @return array
     */
    public function image_sizes() {
        return get_intermediate_image_sizes();
    }




    /**
     * categories
     * 
     * @param void
     * 
     * @return array
     */
    public function categories() {
        $categories = get_categories();
        $categoriesArray = [];

        foreach ($categories as $cat) {
            $newCat = [
                'id' => $cat->cat_ID,
                'slug' => $cat->slug,
                'name' => $cat->name,
                'link' => get_category_link($cat->cat_ID),
            ];

            array_push($categoriesArray, $newCat);
        }
        return $categoriesArray;
    }
}

/**
 * post_loader_rest_api 
 * 
 * @param void
 * 
 * @return Post_Loader_Rest_API
 */
function post_loader_rest_api()
{
    global $post_loader_rest_api;

    // Instantiate only once.
    if ( ! isset( $post_loader_rest_api ) ) {
        $post_loader_rest_api = new Post_Loader_Rest_API();
    }
    return $post_loader_rest_api;
}

// Instantiate
post_loader_rest_api();