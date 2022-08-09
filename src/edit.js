import { __ } from '@wordpress/i18n';

import {
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';

import {
	CheckboxControl,
	TextControl,
	SelectControl,
	Panel,
	PanelBody,
	PanelRow
} from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * Import WordPress Fetch API.
 * 
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-api-fetch/
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Import useState hook.
 * 
 * @see https://reactjs.org/docs/hooks-reference.html#usestate
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-element/
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {

	const { postType, perPage, order, orderby, show } = attributes;

	const [posts, setPosts]	= useState([]);

	const [functionsRes, setFunctionsRes] = useState(new Array());

	const postDate = (postDate) => new Date(postDate);

	const getFormattedDate = (date, userSelect) => {
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

		let formattedDate = postDate(date).toLocaleDateString('en-US', dateFormats[userSelect]);

		userSelect === '6' || userSelect === '7' ? formattedDate = formattedDate.replaceAll('/', '.') : null;

		return formattedDate;
	}

	useEffect( () => {
		let path = `/wp/v2/${postType}?per_page=${perPage || 1}&order=${order}&orderby=${orderby}&_embed`;

		apiFetch( { path: path } )
			.then( ( posts ) => {
				setPosts( posts );
			})
			.catch( ( err ) => {
				console.log(err);
			})
	}, [postType, perPage, order, orderby]);

	useEffect( () => {
		let path = `/post-loader/v1/functions`;

		apiFetch( { path: path } )
			.then( ( functionsRes ) => {
				setFunctionsRes( functionsRes );
			})
			.catch((err) => {
				console.log(err);
			})
	}, [show.thumbnail] );
	
	return (
		<>
			<div { ...useBlockProps() }>
				{posts.map((post) => {
					return (
						<div>
							{show.thumbnail && post._embedded['wp:featuredmedia'] ?
								<img
									src={post._embedded['wp:featuredmedia'][0]['media_details']['sizes'][show.thumbnailSize]['source_url']}
									alt={post._embedded['wp:featuredmedia'][0]['alt_text']}
									height={post._embedded['wp:featuredmedia'][0]['media_details']['sizes'][show.thumbnailSize]['height']}
									width={post._embedded['wp:featuredmedia'][0]['media_details']['sizes'][show.thumbnailSize]['width']} />
								:
								null
							}

							{show.title ? <h2>{post.title.rendered}</h2> : ''}

							{show.date ? <time>{getFormattedDate(post.date, show.dateFormat)}</time> : ''}

							{show.content ? <div className="content" dangerouslySetInnerHTML={{ __html: post.content.rendered }}/> : ''}

							{show.excerpt ? <div className="excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}/> : ''}

							{show.author ? <p>{post._embedded['author'][0].name}</p> : ''}

							{show.categories && post._embedded['wp:term'][0] ? <p><span>{__('Categories: ', 'post-loader')}</span>{post._embedded['wp:term'][0].map( ( cat, i ) => [
								i > 0 && ", ",
								<a href={cat.link}>{cat.name}</a>
							])}</p> : ''}

							{show.tags && post._embedded['wp:term'][1] ? <p><span>{__('Tags: ', 'post-loader')}</span>{post._embedded['wp:term'][1].map( ( tag, i ) => [
								i > 0 && ", ",
								<a href={tag.link}>{tag.name}</a>
							])}</p> : ''}
						</div>
					)
				})}
			</div>

			<InspectorControls>
				<Panel title="Post Loader">
					<PanelBody title="Post Loader Settings" initialOpen={ true }>

						<SelectControl
							label={__( 'Post Type', 'post-loader' )}
							value={ postType }
							options={ [
								{ label: 'Post', value: 'posts' },
								{ label: 'Page', value: 'pages' },
							] }
							onChange={ ( value ) => {
								setAttributes( { postType: value } )
							}}
						/>

						<TextControl
							label={__( 'Per Page', 'post-loader' )}
							type="number"
							value={ perPage }
							min="1"
							max="100"
							onChange={ ( value ) => {
								setAttributes( { perPage: value } )
							}}
						/>

						<SelectControl
							label={__( 'Order', 'post-loader' )}
							value={ order }
							options={ [
								{ label: 'Ascending', value: 'asc' },
								{ label: 'Descending', value: 'desc' },
							] }
							onChange={ ( value ) => {
								setAttributes( { order: value } )
							}}
						/>

						<SelectControl
							label={__( 'Orderby', 'post-loader' )}
							value={ orderby }
							options={ [
								{ label: 'Date', value: 'date' },
								{ label: 'Title', value: 'title' },
								{ label: 'Author', value: 'author' },
								{ label: 'ID', value: 'id' },
							] }
							onChange={ ( value ) => {
								setAttributes( { orderby: value } )
							}}
						/>

						<PanelRow>
							<h2>{__( 'Post Items to Show', 'post-loader' )}</h2>
						</PanelRow>

						<CheckboxControl
							label={ __( 'Title', 'post-loader' ) }
							checked={ show.title }
							onChange={ ( value ) => {
								setAttributes( 
									{ show: {
										...show,
										title: value
									}})
								}
							}
						/>

						<CheckboxControl
							label={ __( 'Date', 'post-loader' ) }
							checked={ show.date }
							onChange={ ( value ) => {
								setAttributes( 
									{ show: {
										...show,
										date: value
									}})
								}
							}
						/>

						{show.date && (
							<SelectControl
								label={__( 'Date Format', 'post-loader' )}
								value={ show.dateFormat }
								options={ [
									{ label: 'Thursday, December 09, 2021', value: '0' },
									{ label: 'Thu, Dec 09, 2021', value: '1' },
									{ label: 'December 09, 2021', value: '2' },
									{ label: 'Dec 09, 2021', value: '3' },
									{ label: '12/09/21', value: '4' },
									{ label: '12/09/2021', value: '5' },
									{ label: '12.09.21', value: '6' },
									{ label: '12.09.2021', value: '7' },
								] }
								onChange={ ( value ) => {
									setAttributes( 
										{ show: {
											...show,
											dateFormat: value
										}})
								}}
							/>
						)}

						<CheckboxControl
							label={ __( 'Content', 'post-loader' ) }
							checked={ show.content }
							onChange={ ( value ) => {
								setAttributes( 
									{ show: {
										...show,
										content: value
									}})
								}
							}
						/>

						<CheckboxControl
							label={ __( 'Excerpt', 'post-loader' ) }
							checked={ show.excerpt }
							onChange={ ( value ) => {
								setAttributes( 
									{ show: {
										...show,
										excerpt: value
									}})
								}
							}
						/>

						<CheckboxControl
							label={ __( 'Thumbnail', 'post-loader' ) }
							checked={ show.thumbnail }
							onChange={ ( value ) => {
								setAttributes( 
									{ show: {
										...show,
										thumbnail: value
									}})
								}
							}
						/>

						{show.thumbnail && (
							<SelectControl
								label={__( 'Thumbnail Size', 'post-loader' )}
								value={ show.thumbnailSize }
								placeholder={ __( '- select -', 'post-loader' ) }
								options={
									functionsRes['image_sizes'] ? functionsRes['image_sizes'].slice(0).reverse().map( ( size ) => {
										return {
											label: size,
											value: size,
										}
									}) : []
								}
								onChange={ ( value ) => {
									setAttributes( 
										{ show: {
											...show,
											thumbnailSize: value
										}})
								}}
							/>
						)}

						<CheckboxControl
							label={ __( 'Author', 'post-loader' ) }
							checked={ show.author }
							onChange={ ( value ) => {
								setAttributes( 
									{ show: {
										...show,
										author: value
									}})
								}
							}
						/>

						<CheckboxControl
							label={ __( 'Categories', 'post-loader' ) }
							checked={ show.categories }
							onChange={ ( value ) => {
								setAttributes( 
									{ show: {
										...show,
										categories: value
									}})
								}
							}
						/>

						<CheckboxControl
							label={ __( 'Tags', 'post-loader' ) }
							checked={ show.tags }
							onChange={ ( value ) => {
								setAttributes( 
									{ show: {
										...show,
										tags: value
									}})
								}
							}
						/>

					</PanelBody>
				</Panel>
			</InspectorControls>
		</>
	);
}
