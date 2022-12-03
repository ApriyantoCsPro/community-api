  create table comments(
     id int not null auto_increment,
     user_id int not null,
     post_id int not null,
     comment varchar(50) not null,
     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     deleted TIMESTAMP DEFAULT NULL,
     primary key(id),
     constraint fk_comments_posts foreign key (post_id) references posts(id),
     constraint fk_comments_users foreign key(user_id) references users(id)
     )engine = innodb;