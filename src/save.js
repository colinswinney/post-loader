/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save({attributes}) {
	const {postType, perPage, order, orderby, show} = attributes;
	return (
		<section
			{ ...useBlockProps.save() }
			aria-label={ __( postType, 'cjsb-post-loader' ) }
			data-post-type={postType}
			data-per-page={perPage}
			data-page-number={1}
			data-order={order}
			data-orderby={orderby}
			data-show-title={show.title}
			data-show-date={show.date}
			data-show-date-format={show.dateFormat}
			data-show-content={show.content}
			data-show-excerpt={show.excerpt}
			data-show-thumbnail={show.thumbnail}
			data-show-thumbnail-size={show.thumbnailSize}
			data-show-author={show.author}
			data-show-categories={show.categories}
			data-show-tags={show.tags}
		/>
	);
}
