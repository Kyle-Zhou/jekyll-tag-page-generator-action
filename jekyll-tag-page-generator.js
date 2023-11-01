'use strict'

const core = require('@actions/core')
const exec = require('@actions/exec')

const fs = require('fs')
const fetch = require('node-fetch')

exports.getFileContents = tag => `---
layout: tag_posts
title: Posts with tag "${tag.name}"
tag: ${tag.name}
---`

exports.writeFile = (destination, tag) => {
	fs.mkdir(destination, { recursive: true }, () => {
		let content = exports.getFileContents(tag)
		let filename = tag.slug + '.md'

		fs.writeFile(destination + filename, content, { flag: 'wx' }, err => {
			if (err) {
				core.info(filename + ' already exists!')
			}
		})
	})

	return Promise.resolve()
}

exports.getTags = source => {
  const settings = { method: "Get" };

  return fetch(source, settings)
    .then(res => res.json())
    .then(json => json.tags)
}

exports.deleteUnused = (destination, tags) => {
	fs.readdir(destination, (err, files) => {
		if (files !== undefined) {
			files.forEach(file => {
				if (tags.some(tag => tag.slug + ".md" !== file)) {
					fs.unlink(destination + '/' + file, err => {
						  if (err) throw err;
						  core.info(file + ' was deleted');
					});

				}
			})
		}
	})

	return tags
}

const getBranchName = async () => {
	let myOutput = '';

	const options = {};
	options.listeners = {
		stdout: (data) => {
			myOutput += data.toString();
		},
	};
  await exec.exec('git', ['rev-parse', '--abbrev-ref', 'HEAD'], options);
  return myOutput;
};

const commit = async (destination, token) => {
  if (token) {
	  await exec.exec('git', ['remote', 'set-url', 'origin',
	    `https://${token}@github.com/${process.env.GITHUB_REPOSITORY}.git`])
	}

	await exec.exec('git', ['config', '--global', 'user.name', 'jekyll-tag-page-generator'])
	await exec.exec('git', ['add', destination + '*.md'])
	await exec.exec('git', ['add', '-u', destination + '*'])

  // Check if there are any changes to commit
	let myOutput = '';
	let myError = '';
	const options = {};
	options.listeners = {
		stdout: (data) => {
			myOutput += data.toString();
		},
		stderr: (data) => {
			myError += data.toString();
		}
	};
	const cmd = "git diff --cached"
  await exec.exec(cmd, "", options);
  if (myOutput.trim() !== "") {  // If there are staged changes
    // await exec.exec('git', ['commit', '-m', 'updating tag directory']);
		// const branchName = await getBranchName();
    // // await exec.exec('git', ['push', 'origin', branchName]);
		// await exec.exec('git', ['push']);

  } else {
    console.log('No changes staged for commit.');
  }
}

exports.run = () => {
  const source = core.getInput('source')
  const destination = core.getInput('destination')
  const github_token = core.getInput('gh_token');
  core.setSecret(github_token);

  exports.getTags(source)
  		 .then(tags => exports.deleteUnused(destination, tags))
         .then(tags => {
        	 tags.forEach(tag => exports.writeFile(destination, tag))
        	 return tags
         })
         .then(() => commit(destination, github_token))
}