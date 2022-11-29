create table subscribers(
     id int not null auto_increment,
     follower_id int not null,
     followee_id int not null,
     deleted timestamp,
     created_at timestamp,
     updated_at timestamp,
     primary key(id),
     constraint fk_follower_users foreign key (follower_id) references users(id),
     constraint fk_followee_users foreign key (followee_id) references users(id)
     )engine = innodb;