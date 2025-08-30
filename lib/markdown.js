import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content');

export function getAllPosts() {
  const postsDir = path.join(postsDirectory, 'posts');
  if (!fs.existsSync(postsDir)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDir);
  const allPostsData = fileNames
    .filter(name => fs.statSync(path.join(postsDir, name)).isDirectory())
    .map(name => {
      const fullPath = path.join(postsDir, name, 'index.md');
      if (!fs.existsSync(fullPath)) {
        return null;
      }
      
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug: name,
        ...matterResult.data,
        content: matterResult.content,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });

  return allPostsData;
}

export function getAllProjects() {
  const projectsDir = path.join(postsDirectory, 'projects');
  if (!fs.existsSync(projectsDir)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(projectsDir);
  const allProjectsData = fileNames
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const fullPath = path.join(projectsDir, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug: name.replace(/\.md$/, ''),
        ...matterResult.data,
        content: matterResult.content,
      };
    })
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });

  return allProjectsData;
}

export function getFeaturedProjects() {
  const featuredDir = path.join(postsDirectory, 'featured');
  if (!fs.existsSync(featuredDir)) {
    return [];
  }
  
  const folders = fs.readdirSync(featuredDir);
  const featuredProjects = folders
    .filter(name => fs.statSync(path.join(featuredDir, name)).isDirectory())
    .map(name => {
      const fullPath = path.join(featuredDir, name, 'index.md');
      if (!fs.existsSync(fullPath)) {
        return null;
      }
      
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug: name,
        ...matterResult.data,
        content: matterResult.content,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });

  return featuredProjects;
}

export async function getAllJobs() {
  const jobsDir = path.join(postsDirectory, 'jobs');
  if (!fs.existsSync(jobsDir)) {
    return [];
  }
  
  const folders = fs.readdirSync(jobsDir);
  const allJobsData = await Promise.all(
    folders
      .filter(name => fs.statSync(path.join(jobsDir, name)).isDirectory())
      .map(async name => {
        const fullPath = path.join(jobsDir, name, 'index.md');
        if (!fs.existsSync(fullPath)) {
          return null;
        }
        
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        const content = await markdownToHtml(matterResult.content);

        return {
          slug: name,
          ...matterResult.data,
          content,
        };
      })
      .filter(Boolean)
  );

  return allJobsData.filter(Boolean);
}

export async function markdownToHtml(markdown) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export function getPostBySlug(slug) {
  const postsDir = path.join(postsDirectory, 'posts');
  const fullPath = path.join(postsDir, slug, 'index.md');
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  return {
    slug,
    ...matterResult.data,
    content: matterResult.content,
  };
}

export function getAllTags() {
  const allPosts = getAllPosts();
  const tags = new Set();
  
  allPosts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tags.add(tag));
    }
  });
  
  return Array.from(tags);
}

export function getPostsByTag(tag) {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.tags && post.tags.includes(tag));
}
