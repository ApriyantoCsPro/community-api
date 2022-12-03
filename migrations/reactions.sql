 create table reactions(
 id int not null auto_increment,
 user_id int not null,
 target_id int not null,
 target_type varchar(10) not null,
 reaction_type varchar(10) not null,
 createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 primary key(id),
 constraint fk_reactions_comments foreign key (target_id) references comments(id),
 constraint fk_reactions_posts foreign key (target_id) references posts(id),
 constraint fk_reactions_users foreign key(user_id) references users(id)
 )engine=innoDB;