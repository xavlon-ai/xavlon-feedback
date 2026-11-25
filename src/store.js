import {randomUUID} from 'node:crypto';
import {filterPublic,validStatus} from './domain.js';
export class Store { constructor(){this.requests=[];this.votes=new Set();this.audit=[];}
 seed(){if(this.requests.length)return; this.create({title:'Dark mode for the board',description:'Please add a comfortable dark colour scheme for evening feedback review.'}); this.create({title:'CSV export',description:'Allow administrators to export filtered requests for planning meetings.'}); this.requests[1].status='planned';}
 create({title,description}){const row={id:randomUUID(),title,description,status:'under_review',votes:0,isPublic:true,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};this.requests.push(row);return row;}
 list(query){return filterPublic(this.requests,query);}
 vote(id,tokenHash,active){const row=this.requests.find(r=>r.id===id&&r.isPublic);if(!row)return null;const key=`${id}:${tokenHash}`,has=this.votes.has(key);if(active&&!has){this.votes.add(key);row.votes++;}if(!active&&has){this.votes.delete(key);row.votes=Math.max(0,row.votes-1);}return {votes:row.votes,active:this.votes.has(key)};}
 adminList(query={}){const q=String(query.q||'').toLowerCase(), status=query.status||'';return this.requests.filter(r=>(!q||`${r.title} ${r.description}`.toLowerCase().includes(q))&&(!status||r.status===status));}
 update(id,input,actor){const r=this.requests.find(x=>x.id===id);if(!r)return null;if(input.status&&!validStatus(input.status))return null;Object.assign(r,input);r.updatedAt=new Date().toISOString();this.audit.push({id,actor,at:r.updatedAt,action:input.isPublic===false?'removed':'updated'});return r;}
}
